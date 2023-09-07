const { Events } = require('discord.js');
const signale = require('signale');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                signale.fatal(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (err) {
                signale.error(`Error executing ${interaction.commandName}`);
                signale.error(err);
            }
        } else if (interaction.isButton()) {
            const command = interaction.client.commands.get(interaction.customId); //WARNING сделать потом нормально и отделить кнопки от комманд!!!
            if (!command) {
                signale.fatal(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (err) {
                signale.error(`Error executing ${interaction.commandName}`);
                signale.error(err);
            }
        }
    },
};