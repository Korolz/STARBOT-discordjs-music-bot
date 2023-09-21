const { EmbedBuilder } = require('discord.js');

module.exports = class QueueHelper {
    static queuedEmbed(trackName, trackLink, trackDuration, tracks, trackRequester) {

        let embedString = 'Queued ';
        if (trackName && !trackLink) embedString += `**${trackName}**`;
        if (trackName && trackLink) embedString += `**${trackName}**`;
        if (trackDuration && trackDuration !== -1) embedString += ` [${trackDuration}]`;
        if (tracks) embedString += ` // ${tracks} 🎶`;
        if (trackRequester) {
            if (!trackRequester.id) embedString += ` • <@${trackRequester}>`;
            else embedString += ` • by <@${trackRequester.id}>`;
        }

        const embed = new EmbedBuilder()
            .setDescription(embedString)
            .setColor([179, 139, 71]);
        return embed;
    }
};