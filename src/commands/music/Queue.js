const { useQueue } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('Shows current queue of tracks'),

    async execute(interaction){
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

        let size = 0;
        if (queue)
            size = queue.tracks.size;

        let embed = new EmbedBuilder()
            .setTitle('**Queue**')
            .setColor([133, 105, 60]);

        for(let i = 0; i < size && i < 10; i++) {
            let title = queue.tracks[i].title;
            embed.addFields({value: `${i+1}: ${title}`,inline: false});
        }
        embed.addFields({value: `**Queue Size**: ${size}` ,inline: false});
        return interaction.reply({embeds: [embed]});
    }
}