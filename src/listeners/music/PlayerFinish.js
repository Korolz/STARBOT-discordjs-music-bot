const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: "playerFinish",
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
            .setAuthor({ name: track.author, /*iconURL: ''*/})
            .setThumbnail(track.thumbnail)
            .setTitle(track.title)
            /*.setFooter({
                text: `Played by: ${track.requestedBy.id}`,
                iconURL: `${track.requestedBy.displayAvatarURL()}`,
            })*/
            .setTimestamp();

        return queue.metadata.channel.send({content: 'Finished!'});
    },
};