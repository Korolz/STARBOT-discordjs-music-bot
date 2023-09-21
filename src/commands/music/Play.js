const { useMainPlayer, useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');
const QueueHelper = require('../../structures/Music/QueueHelper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('p')
        .setDescription('Plays a song')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Name or URL of a song')
                .setRequired(true)
        ),

    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) {
            return interaction.reply({
                content: 'You are not in a voice channel!',
                ephemeral: true,
            });
        }
        if (!channel.joinable) {
            return interaction.reply({
                content: 'I cannot join your voice channel!',
                ephemeral: true,
            });
        }

        // check if the bot has already joined another channel in this guild
        const queue = useQueue(interaction.guild.id);
        if (queue && queue.channel !== channel) {
            return interaction.reply({
                content: 'I am already playing in another channel!',
                ephemeral: true,
            });
        }

        const query = interaction.options.getString('query', true); //what we have typed in command options

        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        //searching track
        const searchResult = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (searchResult.isEmpty())
            return interaction.editReply(`No results were found for your query ${query}!`);

        let size = 0;
        if (queue)
            size = queue.tracks.size; //because empty queue == null

        try {
            const {track} = await player.play(channel, searchResult, {
                nodeOptions: {
                    metadata: {
                        channel: interaction.channel,
                        client: interaction.guild.members.me,
                        requestedBy: interaction.user
                    },
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 60000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 300000,
                }
            });
            if(searchResult.playlist === null){
                return interaction.editReply({
                    content: null,
                    embeds: [QueueHelper.queuedEmbed(track.title, track.url, track.duration, size, interaction.user)]
                });
            }
            return interaction.editReply({
                content: null,
                embeds: [QueueHelper.queuedEmbed(searchResult.playlist.title, searchResult.playlist.url, searchResult.playlist.durationFormatted, size, interaction.user)]
            });
        } catch (err) {
            console.log(err);
            return interaction.editReply({
                content: 'There was an error trying to play this playlist!\n',
                ephemeral: true
            });
        }
    }
}