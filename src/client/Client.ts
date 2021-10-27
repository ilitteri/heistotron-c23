import fs from 'fs';
import path from 'path';
import consola, { Consola } from 'consola';

import { Client, Intents, Collection } from 'discord.js';
import { Config } from '../interfaces/Config';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';

class Bot extends Client {
    public logger: Consola = consola;
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config!: Config;

    public constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_WEBHOOKS,
            ],
        });
    }

    public async start(config: Config): Promise<void> {
        this.config = config;
        await this.loadEvents();
        super.login(config.token);
    }

    private async loadEvents() {
        this.logger.info(`Loading events...`);

        const eventFiles = fs
            .readdirSync(path.resolve(__dirname, '../events'))
            .filter((file) => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
            this.logger.success(`Listening to ${event.name} event.`);
        }

        this.logger.success(`Events loaded.`);
    }
}

export { Bot as AlgoBot };
