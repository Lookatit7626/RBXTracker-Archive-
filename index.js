// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const https = require('https');

const RobloxAPIListToCall = [
    ["Games", "https://games.roblox.com/v2/users/1/games"],
    ["Groups", "https://groups.roblox.com/v1/groups/1"],
    ["Auth", "https://auth.roblox.com/v1/metadata"],
    ["Users", "https://users.roblox.com/v1/users/1"],
    ["Friends", "https://friends.roblox.com/v1/metadata"],
    ["Thumbnail", "https://www.roblox.com/item-thumbnails?params=%5B%7BassetId:1818%7D%5D"], 
    ["Version", "https://www.roblox.com/MobileAPI/Check-App-Version?appVersion=AppiOSV2.112.35972"],
    ["Search", "https://apis.roblox.com/games-autocomplete/v1/get-suggestion/chillichicken3"], 
    ["TwoStepVerification", "https://twostepverification.roblox.com/v1/metadata"],
    ["Account Information", "https://accountinformation.roblox.com/v1/metadata"],
    ["Chat", "https://chat.roblox.com/v2/metadata"],
    ["Voice Chat", "https://voice.roblox.com/"],
    ["Badge", "https://apis.roblox.com/legacy-badges"],
    ["Client Information", "https://clientsettings.roblox.com/v2/user-channel"],
    ["Economics", "https://economy.roblox.com/v1/user/currency"],
    ["Game Join", "https://gamejoin.roblox.com/v1/metadata"],
    ["Avatar", "https://avatar.roblox.com/v1/avatar/metadata"],
    ["Catalog", "https://catalog.roblox.com//v1/users/1/bundles"],
    ["Game Internationalization", "https://gameinternationalization.roblox.com/v2/supported-languages/games/4924922222"],
    ["Presence (User)", "https://presence.roblox.com/v1/presence/users"],
    ["Trade", "https://trades.roblox.com/v1/trades/metadata"],
];

const AllowedReturnRequest = [200, 404, 429, 401, 405];

const GreenCode = new Set();
const YellowCode = new Set();
const RedCode = new Set();

const token = process.env['Token'];

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as: ${readyClient.user.tag}`);
    const GUILD_ID = '1158555888609677373';
    const CHANNEL_ID = '1299895390744870972';

    // Find the channel and send a message
    const guild = client.guilds.cache.get(GUILD_ID);
    if (guild) {
        const channel = guild.channels.cache.get(CHANNEL_ID);
        if (channel) {
            channel.send('Restarted!')
                .then(() => console.log('Message sent!'))
                .catch(console.error);

            setInterval(() => {
                if (Array.isArray(RobloxAPIListToCall) && RobloxAPIListToCall.length > 0) {
                    RobloxAPIListToCall.forEach(([label, url]) => {
                        const responseTimer = Date.now();
                        https.get(url, (response) => {
                            const responseTime = Date.now() - responseTimer;

                            if (AllowedReturnRequest.includes(response.statusCode)) {
                                const embed = new EmbedBuilder()
                                    .setColor('#00ff00') // Green for up
                                    .setTitle(`${label} is up!`)
                                    .setURL(url)
                                    .setAuthor({ name: 'Status Bot' })
                                    .addFields(
                                        { name: 'Response Code', value: response.statusCode.toString(), inline: true },
                                        { name: 'Response Time', value: `${responseTime} ms`, inline: true }
                                    )
                                    .setFooter({ text: 'Status Check' })
                                    .setTimestamp();

                                channel.send({ embeds: [embed] });
                                
                                // Manage status codes
                                GreenCode.add(label);
                                RedCode.delete(label);
                                YellowCode.delete(label);

                                console.log(`[${label}] Request successful, Response ${response.statusCode}, Response time ${responseTime} ms`);
                            } else {
                                const embed = new EmbedBuilder()
                                    .setColor('#ff0000') // Red for down
                                    .setTitle(`${label} is down!`)
                                    .setURL(url)
                                    .setAuthor({ name: 'Status Bot' })
                                    .addFields(
                                        { name: 'Response Code', value: response.statusCode.toString(), inline: true },
                                        { name: 'Response Time', value: `${responseTime} ms`, inline: true }
                                    )
                                    .setFooter({ text: 'Status Check' })
                                    .setTimestamp();

                                channel.send({ embeds: [embed] });
                                
                                // Manage status codes
                                RedCode.add(label);
                                GreenCode.delete(label);
                                YellowCode.delete(label);

                                console.log(`[${label}] Request unsuccessful, Response ${response.statusCode}, Response time ${responseTime} ms`);
                            }
                        }).on('error', (error) => {
                            console.error(`${label} Error: ${error.message}`);
                        });
                    });
                } else {
                    console.error('Roblox API list is not defined or empty.');
                }
            }, 30000); // 30000 ms = 30 seconds
        } else {
            console.log('Channel not found!');
        }
    } else {
        console.log('Guild not found!');
    }
});

// Log in to Discord with your client's token
client.login(token);
