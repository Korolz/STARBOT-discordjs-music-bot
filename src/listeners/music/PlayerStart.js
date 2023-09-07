const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const formatDuration = require('../../structures/formatDuration');

module.exports = {
    name: "playerStart",
    execute(queue, track) {

        const loop = new ButtonBuilder()
            .setCustomId('l')
            .setStyle(!queue.repeatMode ? ButtonStyle.Secondary : ButtonStyle.Primary)
            .setEmoji(queue.repeatMode ? '🔂' : '🔁');
        const prev = new ButtonBuilder()
            .setCustomId('prev')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏮');
        const pause = new ButtonBuilder()
            .setCustomId('pause')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('⏸');
        const skip = new ButtonBuilder()
            .setCustomId('s')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏭');
        const addToQueue = new ButtonBuilder()
            .setCustomId('add')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('💖');

        const buttonRow = new ActionRowBuilder({components: [loop, prev,pause,skip,addToQueue]});

        const embed = new EmbedBuilder()
            .setColor([222, 217, 204])
            .setAuthor({ name: 'STARBOT is now playing...', iconURL: 'https://yt3.googleusercontent.com/N465z97NO4r0e5p_MGKo2pZmbFwbfUrLarsZ-_HOUIhyzu25VF9pB61jhEChzQyoeQpEnWFu=s176-c-k-c0x00ffffff-no-rj'})
            .setThumbnail(track.thumbnail)
            .setTitle(track.title)
            .setDescription(`by ${track.author}`)
            .setTimestamp();

        return queue.metadata.channel.send({ embeds: [embed], components: [buttonRow] }).then(msg => {
            setTimeout(() => msg.delete(), formatDuration(track.duration)*1000)
        }).catch(e => console.log('something with nowPlayingMessage: ',e));
    },
};