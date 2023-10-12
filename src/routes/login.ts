import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";
import { CS571HW6DbConnector } from '../services/hw6-db-connector';
import { CS571HW6TokenAgent } from '../services/hw6-token-agent';
import { CS571Config } from '@cs571/f23-api-middleware';
import HW6PublicConfig from '../model/configs/hw6-public-config';
import HW6SecretConfig from '../model/configs/hw6-secret-config';

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
        app.post(CS571LoginRoute.ROUTE_NAME, (req, res) => {
            const username = req.body.username?.trim();
            const password = req.body.password?.trim();
            
            if (!username || !password) {
                res.status(400).send({
                    msg:  "A request must contain a 'username' and 'password'"
                });
                return;
            }
        })
    }

    public getRouteName(): string {
        return CS571LoginRoute.ROUTE_NAME;
    }
}