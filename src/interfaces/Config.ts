export interface Config {
    clientID: string;
    guildID: string;
    token: string;
    roles: {
        [key: string]: string;
    };
    textChannels: {
        [key: string]: string;
    };
    voiceChannels: object;
}
