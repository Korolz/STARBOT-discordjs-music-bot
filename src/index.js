const {DISCORD_TOKEN, CLIENT_ID, CLIENT_USERNAME } = require('../config.json');
const signale = require('signale');
const figlet = require('figlet');
const Starbot = require('./structures/Client');
const Starplayer = require('./structures/Player');

console.log(figlet.textSync(CLIENT_USERNAME, {font: 'Alligator'}));
signale.await('Logging in');

const starbot = new Starbot();
const starplayer = new Starplayer(starbot);

// Log in to Discord with your client's token
starbot.login(DISCORD_TOKEN).catch(err => signale.fatal(err));
// starting music part
starplayer.start().catch(err => signale.fatal(err));