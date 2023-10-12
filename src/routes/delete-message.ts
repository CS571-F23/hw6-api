import { Express } from 'express';

import { CS571Route } from "@cs571/f23-api-middleware/src/interfaces/route";
import { CS571HW6DbConnector } from '../services/hw6-db-connector';
import { CS571HW6TokenAgent } from '../services/hw6-token-agent';

export class CS571DeleteMessageRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/messages';

    private readonly connector: CS571HW6DbConnector;
    private readonly tokenAgent: CS571HW6TokenAgent;

    private readonly chatrooms: string[];

    public constructor(chatrooms: string[], connector: CS571HW6DbConnector, tokenAgent: CS571HW6TokenAgent) {
        this.chatrooms = chatrooms;
        this.connector = connector;
        this.tokenAgent = tokenAgent;
    }

    public addRoute(app: Express): void {
        app.delete(CS571DeleteMessageRoute.ROUTE_NAME, (req, res) => {
            const chatroomName = req.params.chatroomName;

            if (!this.chatrooms.includes(chatroomName)) {
                res.status(404).send({
                    msg: "The specified chatroom does not exist. Chatroom names are case-sensitive."
                });
                return;
            }
            
        })
    }

    public getRouteName(): string {
        return CS571DeleteMessageRoute.ROUTE_NAME;
    }
}