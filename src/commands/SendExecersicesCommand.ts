import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { ExecuteFunction } from '../interfaces/Command';

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

export const execute: ExecuteFunction = async (
    interaction: CommandInteraction
): Promise<void> => {
    await interaction.deferReply({ ephemeral: true });

    const guideName = interaction.options.getString('guia')!;
    child_process.spawn('python3', [`./submodules/main.py ${guideName}`]);

    const guild = interaction.guild!;
    const textChannelParent = await guild.channels.create(guideName, {
        type: 'GUILD_CATEGORY',
    });

    const exerciseFiles = fs.readdirSync(
        path.resolve(__dirname, '../../assets', guideName)
    );

    for (const excerciseFile of exerciseFiles) {
        const excerciseName = excerciseFile.split('.')[0];
        const textChannel = await guild.channels.create(excerciseName, {
            type: 'GUILD_TEXT',
            parent: textChannelParent,
        });
        const message = await textChannel.send({
            files: [`./assets/${guideName}/${excerciseName}`],
        });
        await message.pin();
    }
    await interaction.reply('Guía de ejercicios cargada!');
};

export const data = new SlashCommandBuilder()
    .setName('cargar_guia')
    .setDescription(
        'Crea una categoría con canales para todos los ejercicios de una guía.'
    )
    .addStringOption((option) =>
        option
            .addChoice('GUIA-01', 'GUIA-01')
            .addChoice('GUIA-02', 'GUIA-02')
            .addChoice('GUIA-03', 'GUIA-03')
            .addChoice('GUIA-04', 'GUIA-04')
            .addChoice('GUIA-05', 'GUIA-05')
            .addChoice('GUIA-06', 'GUIA-06')
            .setName('guia')
            .setDescription('Paper List')
            .setRequired(true)
    );
