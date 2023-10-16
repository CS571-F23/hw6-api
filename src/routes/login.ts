import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";
import { CS571HW6DbConnector } from '../services/hw6-db-connector';
import { CS571HW6TokenAgent } from '../services/hw6-token-agent';
import { CS571Config } from '@cs571/f23-api-middleware';
import HW6PublicConfig from '../model/configs/hw6-public-config';
import HW6SecretConfig from '../model/configs/hw6-secret-config';
import BadgerUser from '../model/badger-user';

export class CS571LoginRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/login';

    private readonly connector: CS571HW6DbConnector;
    private readonly tokenAgent: CS571HW6TokenAgent;
    private readonly config: CS571Config<HW6PublicConfig, HW6SecretConfig>


    public constructor(connector: CS571HW6DbConnector, tokenAgent: CS571HW6TokenAgent, config: CS571Config<HW6PublicConfig, HW6SecretConfig>) {
        this.connector = connector;
        this.tokenAgent = tokenAgent;
        this.config = config;
    }

    public addRoute(app: Express): void {
        app.post(CS571LoginRoute.ROUTE_NAME, async (req, res) => {
            const username = req.body.username?.trim();
            const password = req.body.password?.trim();

            if (!username || !password) {
                res.status(400).send({
                    msg:  "A request must contain a 'username' and 'password'"
                });
                return;
            }

            const pers = await this.connector.findUserIfExists(username)
            
            if (!pers) {
                // bogus calculation to mirror true hash calculation
                CS571HW6DbConnector.calculateHash(new Date().getTime().toString(), password)
                this.delayResponse(() => {
                    res.status(401).send({
                        msg: "That username or password is incorrect!",
                    })
                });
                return;
            }

            const hash = CS571HW6DbConnector.calculateHash(pers.salt, password)

            if (hash !== pers.password) {
                this.delayResponse(() => {
                    res.status(401).send({
                        msg: "That username or password is incorrect!",
                    })
                });
                return;
            }

            const cook = this.tokenAgent.generateAccessToken(new BadgerUser(pers.id, pers.username));

            res.status(200).cookie(
                'badgerchat_auth',
                cook,
                {
                    domain: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED ? 'cs571.org' : undefined,
                    sameSite: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED ? "none" : "lax",
                    secure: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED,
                    maxAge: 3600000,
                    httpOnly: true,
                }
            ).send({
                msg: "Successfully authenticated.",
                user: {
                    id: pers.id,
                    username: pers.username
                },
                eat: this.tokenAgent.getExpFromToken(cook)
            })
        })
    }

    public async delayResponse(cb: () => void): Promise<void> {
        return new Promise((resolve: any) => {
            setTimeout(() => {
                cb()
                resolve();
            }, Math.ceil(Math.random() * 100))
        })
        
    }

    public getRouteName(): string {
        return CS571LoginRoute.ROUTE_NAME;
    }
}
