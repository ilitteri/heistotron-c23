import { Config } from './interfaces/Config';
import { AlgoBot } from './client/Client';
import dotenv from 'dotenv';
import defaultConfig from '../config/default.json';
dotenv.config();

const client: AlgoBot = new AlgoBot();

const config: Config = {
    clientID: process.env.CLIENT_ID as string,
    guildID: process.env.GUILD_ID as string,
    token: process.env.TOKEN as string,
    roles: defaultConfig.roleIDs,
    textChannels: defaultConfig.textChannels,
    voiceChannels: defaultConfig.voiceChannels,
};

client.start(config);

export { client };
