// import { TextChannel } from 'discord.js';
import { AlgoBot } from '../client/Client';
import { ExecuteFunction } from '../interfaces/Event';
import fs from 'fs';
import path from 'path';

export const execute: ExecuteFunction = async (client: AlgoBot) => {
    client.logger.success(`Ready! Loaded & Logged in as ${client.user!.tag}`);
    loadExcercises(client);
};

async function loadExcercises(client: AlgoBot): Promise<void> {
    const folders = fs.readdirSync(path.resolve(__dirname, '../../assets'));
    const guild = await client.guilds.fetch(client.config.guildID);
    for (const folder of folders) {
        const parent = await guild.channels.create(folder, {
            type: 'GUILD_CATEGORY',
        });
        const files = fs.readdirSync(
            path.resolve(__dirname, '../../assets', folder)
        );
        for (const file of files) {
            const textChannelName = file.split('.')[0];
            const textChannel = await guild.channels.create(textChannelName, {
                type: 'GUILD_TEXT',
                parent: parent,
            });
            const message = await textChannel.send({
                files: ['./assets/GUIA-01/ejercicio-01.png'],
            });
            await message.pin();
        }
    }
}

export const name: string = 'ready';

export const once: boolean = true;
