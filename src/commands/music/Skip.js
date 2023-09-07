const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('s')
        .setDescription('skips the current song'),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;
        const queue = useQueue(interaction.guild.id)
        if (!channel) {
            return interaction.reply({
                content: 'You are not in a voice channel!',
                ephemeral: true,
            });
        }
        if (!queue.currentTrack) {
            return interaction.reply({
                content: 'There is no song playing!',
                ephemeral: true,
            });
        }
        // check if the user is in the same channel as the bot
        if (channel !== queue.channel) {
            return interaction.reply({
                content: 'You are not in the same channel as the bot!',
                ephemeral: true,
            });
        }

        // skip the current song
        queue.node.skip();
        await interaction.reply({
            content: `Skipped ${queue.currentTrack.title}`,
            ephemeral: true,
        });

    }
};