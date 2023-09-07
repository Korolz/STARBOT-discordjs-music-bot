//const readline = require('readline');
const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const TOKEN_DIR = path.join(__dirname, '../../resources/');
const OAUTH_PATH = path.join(TOKEN_DIR, 'yt-oauth.json');
const TOKEN_PATH = path.join(TOKEN_DIR, 'youtube-token.json');
const SCOPES = [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.third-party-link.creator',
];
const content = fs.readFileSync(OAUTH_PATH, 'utf8');
const credentials = JSON.parse(content);

module.exports = class YTClient {

    constructor(interaction) {
        this.interaction = interaction; //implementing interaction from discordjs to do auth via Discord chat
    }
    clientSecret = credentials.installed.client_secret;
    clientId = credentials.installed.client_id;
    redirectUrl = credentials.installed.redirect_uris[0];
    oauth2Client = new OAuth2(this.clientId, this.clientSecret, this.redirectUrl);

    async authorize() {
        // Check if we have previously stored a token.
        try {
            const token = fs.readFileSync(TOKEN_PATH,'utf8');
            this.oauth2Client.credentials = JSON.parse(token);
        }
        catch {
            await this.getNewToken(this.storeToken, this.interaction, this.oauth2Client);
        }
    }

    async getNewToken(storeToken, interaction , oauth2Client) {
        const authUrl = oauth2Client.generateAuthUrl({
            approval_prompt: 'force',
            access_type: 'offline',
            scope: SCOPES
        });
        await interaction.deferReply();
        await interaction.followUp(`Please, [AUTHORIZE](${authUrl}) to get access to **Youtube Account** of the bot!\nAfter authorization **enter the string** between \`code=\` and \`&scope=\`\nYou have **1 minute** to do so`);
        const collector = interaction.channel.createMessageCollector({ maxProcessed: 1, time: 60000 });
        collector.on('collect', m => {
            console.log(`Collected ${m.content}`);
            oauth2Client.getToken(m.content, function(err, token) {
                if (err) {
                    m.react('❌');
                    m.reply('Error while trying to retrieve access token :/\nPlease, make sure to enter the string between \`code=\` and \`&scope=\`\nCall command one more time and try again');
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                m.react('✅');
                oauth2Client.credentials = token;
                storeToken(token);
                m.reply('You can use youtube commands again');
            });
        });
    }

    storeToken(token){
        try {
            fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) throw err;
            console.log('Token stored to ' + TOKEN_PATH);
        });
    }

     async getPlaylists(){
        const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
        try {
            const response = await youtube.playlists.list({
                part: ['snippet','contentDetails'],
                mine: true,
            });

            const playlists = response.data.items;
            let playlistsArray = [];
            playlists.forEach((playlist) => {
                let obj = {
                    name: playlist.snippet.title,
                    value: `${playlist.snippet.description}\nhttps://youtube.com/playlist?list=${playlist.id}\nTracks: ${playlist.contentDetails.itemCount}`
                };
                playlistsArray.push(obj);
            });
            return playlistsArray;
        }
        catch (error) {
            console.error('Error fetching playlists:', error.message);
            await this.getNewToken(this.storeToken, this.interaction, this.oauth2Client); //EXPERIMENTAL in case of invalid_grant error
        }
    }


}