const { Events } = require('discord.js');
const signale = require('signale');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        signale.success(`Ready! Logged in as ${client.user.tag}`);
    },
};