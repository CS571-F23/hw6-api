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
        app.post(CS571WhoAmIRoute.ROUTE_NAME, (req, res) => {

        })
    }

    public getRouteName(): string {
        return CS571WhoAmIRoute.ROUTE_NAME;
    }
}