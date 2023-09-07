const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shut')
        .setDescription('Full bot shutdown'),

    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        const queue = useQueue(interaction.guild.id)
        if (!channel) {
            return interaction.reply({
                content: 'You are not in a voice channel!',
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

        //shutting down
        queue.delete();
        await interaction.reply({
            content: 'Bye!',
            ephemeral: true,
        });

    }
};