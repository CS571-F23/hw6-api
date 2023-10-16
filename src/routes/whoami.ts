import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";
import { CS571HW6DbConnector } from '../services/hw6-db-connector';
import { CS571HW6TokenAgent } from '../services/hw6-token-agent';

export class CS571WhoAmIRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/whoami';

    private readonly connector: CS571HW6DbConnector;
    private readonly tokenAgent: CS571HW6TokenAgent;

    public constructor(connector: CS571HW6DbConnector, tokenAgent: CS571HW6TokenAgent) {
        this.connector = connector;
        this.tokenAgent = tokenAgent;
    }

    public addRoute(app: Express): void {
        app.get(CS571WhoAmIRoute.ROUTE_NAME, async (req, res) => {
            const user = await this.tokenAgent.validateToken(req.cookies['badgerchat_auth']);
            res.status(200).send({
                isLoggedIn: user ? true : false,
                user: user
            })
        })
    }

    public getRouteName(): string {
        return CS571WhoAmIRoute.ROUTE_NAME;
    }
}
