const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const signale = require('signale');

const commandsPath = path.join(__dirname, '../commands');
const commandsFolder = fs.readdirSync(commandsPath);
const listenersPath = path.join(__dirname, '../listeners');
const listenersFolder = fs.readdirSync(listenersPath);

module.exports = class Client extends Discord.Client {
    constructor() {
        super({ intents:
                [
                    Discord.GatewayIntentBits.Guilds,
                    Discord.GatewayIntentBits.GuildMessages,
                    Discord.GatewayIntentBits.MessageContent,
                    Discord.GatewayIntentBits.GuildVoiceStates //for discord-player
                ]
        });

        this.commands = new Discord.Collection();
    }

    loadCommands() {
        commandsFolder.forEach(category => {
            const categoryPath = path.join(commandsPath, `${category}`);
            const categories = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
            categories.forEach(command => {
                const commandPath = path.join(categoryPath, `${command}`);
                const cmd = require(commandPath);
                //checking for validation
                if ('data' in cmd && 'execute' in cmd) {
                    this.commands.set(cmd.data.name, cmd);
                } else {
                    signale.warning(`The command at ${commandPath} is missing a required "data" or "execute" property!`);
                }
            });
        });
    }

    loadListeners() {
        listenersFolder.forEach(async (eventFolder) => {
            const eventFolderPath = path.join(listenersPath, `${eventFolder}`);
            const events = fs.readdirSync(eventFolderPath).filter(c => c.split('.').pop() === 'js');
            if (eventFolder !== 'music') {
                events.forEach(eventStr => {
                    if (!events.length) throw Error('No event files found!');
                    const eventPath = path.join(eventFolderPath, `${eventStr}`);
                    const event = require(eventPath);
                    if (event.once) {
                        this.once(event.name, (...args) => event.execute(...args));
                    } else {
                        this.on(event.name, (...args) => event.execute(...args));
                    }
                });
            }
        });
    }

    async login(token) {
        await super.login(token);
        this.loadCommands();
        this.loadListeners();
    }
}