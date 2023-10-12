import { CS571Config } from "@cs571/f23-api-middleware";
import HW6PublicConfig from "../model/configs/hw6-public-config";
import HW6SecretConfig from "../model/configs/hw6-secret-config";

import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import BadgerUser from "../model/badger-user";


export class CS571HW6TokenAgent {

    public static readonly DEFAULT_EXP: number = 60 * 60;

    private readonly config: CS571Config<HW6PublicConfig, HW6SecretConfig>;

    public constructor(config: CS571Config<HW6PublicConfig, HW6SecretConfig>) {
        this.config = config;
    }

    public async validateToken<T = any>(token: string): Promise<T | undefined> {
        return new Promise((resolve: any) => {
            jwt.verify(token, this.config.SECRET_CONFIG.JWT_SECRET, (err: any, body: any): void => {
                if (err) {
                    resolve(undefined)
                } else {
                    resolve(body as T)
                }
            })
        });
    }


    public generateAccessToken(user: BadgerUser, exp?: number): string {
        return this.generateToken({ ...user }, exp ?? CS571HW6TokenAgent.DEFAULT_EXP);
    }

    public generateToken(tokenBody: any, exp: number) {
        return jwt.sign(tokenBody, this.config.SECRET_CONFIG.JWT_SECRET, { expiresIn: `${exp}s` });
    }
}