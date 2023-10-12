
import { DataTypes, Sequelize, ModelStatic } from "sequelize";
import { CS571Config } from "@cs571/f23-api-middleware";
import HW6PublicConfig from "../model/configs/hw6-public-config";
import HW6SecretConfig from "../model/configs/hw6-secret-config";
import { BadgerUserRegistration } from "../model/badger-user-registration";
import BadgerUser from "../model/badger-user";

import crypto from 'crypto'

export class CS571HW6DbConnector {

    private badgerMessagesTable!: ModelStatic<any>;
    private badgerUsersTable!: ModelStatic<any>;


    private readonly sequelize: Sequelize
    private readonly config: CS571Config<HW6PublicConfig, HW6SecretConfig>;

    public constructor(config: CS571Config<HW6PublicConfig, HW6SecretConfig>) {
        this.config = config;
        this.sequelize = new Sequelize(
            this.config.SECRET_CONFIG.SQL_CONN_DB,
            this.config.SECRET_CONFIG.SQL_CONN_USER,
            this.config.SECRET_CONFIG.SQL_CONN_PASS,
            {
                host: this.config.SECRET_CONFIG.SQL_CONN_ADDR,
                port: this.config.SECRET_CONFIG.SQL_CONN_PORT,
                dialect: 'mysql'
            }
        );
    }

    public async init() {
        await this.sequelize.authenticate();
        this.badgerUsersTable = await this.sequelize.define("BadgerUser", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            badger_id: {
                type: DataTypes.STRING(68), // bid_ + 64 chars
                allowNull: false
            },
            salt: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            username: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            created: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        });
        await this.sequelize.sync()
        this.badgerMessagesTable = await this.sequelize.define("BadgerMessage", {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                unique: true,
                allowNull: false
            },
            poster: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            badger_id: {
                type: DataTypes.STRING(68), // bid_ + 64 chars
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            content: {
                type: DataTypes.STRING(1024),
                allowNull: false
            },
            chatroom: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            created: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            charset: 'utf8',
            collate: 'utf8_unicode_ci'
        });
        await this.sequelize.sync()
    }

    public async findUserIfExists<T>(username: string): Promise<T | undefined> {
        const pers = await this.badgerUsersTable.findOne({ where: { username } });
        return pers ?? undefined;
    }

    public async createBadgerUser(user: BadgerUserRegistration): Promise<BadgerUser> {

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.createHmac('sha256', salt).update(user.password).digest('hex');

        await this.badgerUsersTable.create({
            username: user.username,
            password: hash,
            badger_id: user.bid,
            salt: salt,
            created: new Date()
        });

        const newUser = await this.badgerUsersTable.findOne({ where: { username: user.username } });

        return new BadgerUser(newUser.id, newUser.username);
    }
}