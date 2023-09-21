const { Player } = require('discord-player');
const { SpotifyExtractor, SoundCloudExtractor, YoutubeExtractor } = require('@discord-player/extractor');
const path = require("node:path");
const fs = require("node:fs");
const signale = require('signale');

const listenersPath = path.join(__dirname, '../../listeners');

module.exports = class StarPlayer extends Player {
    constructor(client) {
        super(client);
    }

    loadPlayerListeners() {
        const eventFolderPath = path.join(listenersPath, `music`);
        const events = fs.readdirSync(eventFolderPath).filter(c => c.split('.').pop() === 'js');
        events.forEach(async (eventStr) => {
            if (!events.length) throw Error('No player event files found!');
            const musicEventPath = path.join(eventFolderPath, `${eventStr}`);
            const event = require(musicEventPath);
            this.events.on(event.name, (...args) => event.execute(...args));
        });
    }

    async start(){
        await this.extractors.register(YoutubeExtractor, {});
        await this.extractors.register(SpotifyExtractor, {});
        await this.extractors.register(SoundCloudExtractor, {});
        signale.success('Ready! StarPlayer ONLINE');
        this.loadPlayerListeners();
    }

}