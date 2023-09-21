const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const YTClient = require('../../structures/Music/YTClient');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlists')
        .setDescription('Replies with playlists!'),

    async execute(interaction) {
        const yt = new YTClient(interaction);
        const playlistsEmbed = new EmbedBuilder()
            .setColor([88, 71, 49])
            .setTitle('Playlists')
            .setDescription('List of Available Bot Youtube playlists')
            .setThumbnail('https://yt3.googleusercontent.com/N465z97NO4r0e5p_MGKo2pZmbFwbfUrLarsZ-_HOUIhyzu25VF9pB61jhEChzQyoeQpEnWFu=s176-c-k-c0x00ffffff-no-rj');

        try{
            await yt.authorize();
            const content = await yt.getPlaylists();
            if(typeof content != 'undefined') {
                content.forEach((item) => {
                    playlistsEmbed.addFields(item)
                });
                await interaction.reply({embeds: [playlistsEmbed]});
            }
        }
        catch(e) {
            console.log(e);
        }
    }
};