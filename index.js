const express = require('express');
const app = express();
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const https = require('https');
const port = 8080;

app.get('/', (req, res) => {
    res.send('Back-end');
});

app.listen(port, () => {
    console.log(`PORT : ${port}`);
});

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
    ["Billing", "https://billing.roblox.com/v1/metadata"],
    ["Client Settings (CDN)", "https://clientsettingscdn.roblox.com/v1/"],
    ["Datastore","https://apis.roblox.com/datastores/v1/universes/4924922222/standard-datastores"],
];

const AllowedReturnRequest = [200, 404, 429, 401, 405];

const GreenCode = [];
const YellowCode = [];
const RedCode = [];

const token = process.env['Token'];

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

const allowedUserIds = ['874574233513111573', '743455903797215293'];
let isActive = true;

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return; // Ignore bot messages

    // Command to toggle the bot state
    if (allowedUserIds.includes(message.author.id)) {
        if (message.content === '!kill') {
            isActive = false; // Turn off the bot
            message.channel.send('Bot has been turned off.'); 
        } else if (message.content === '!status') {
            message.channel.send('Getting status...');
            const requests = RobloxAPIListToCall.map(([label, url]) => 
                new Promise((resolve) => {
                    const responseTimer = Date.now();
                    https.get(url, (response) => {
                        const responseTime = Date.now() - responseTimer;
                        resolve({ label, url, statusCode: response.statusCode, responseTime });
                    }).on('error', (error) => {
                        resolve({ label, url, statusCode: null, error: error.message });
                    });
                })
            );						

            const results = await Promise.all(requests);
            let Embed = "STATUS :\n"
            results.forEach(({url, label, statusCode, responseTime, error }) => {
                Embed = Embed + `${label} Status : ${statusCode} : Response time : ${responseTime} ms\n`
            });
            message.channel.send(Embed);
        }
    }
});


client.once(Events.ClientReady, async readyClient => {
    console.log(`Ready! Logged in as: ${readyClient.user.tag}`);
    const GUILD_ID = '1158555888609677373';
    const CHANNEL_ID = '1300078672807596112';

    const guild = client.guilds.cache.get(GUILD_ID);
    if (guild) {
        const channel = guild.channels.cache.get(CHANNEL_ID);
        if (channel) {
            channel.send('Restarted!')
                .then(() => console.log('Message sent!'))
                .catch(console.error);

            setInterval(async () => {
                if (isActive) {
                    try {
                        const requests = RobloxAPIListToCall.map(([label, url]) => 
							new Promise((resolve) => {
								const responseTimer = Date.now();
								https.get(url, (response) => {
									const responseTime = Date.now() - responseTimer;
									resolve({ label, url, statusCode: response.statusCode, responseTime });
								}).on('error', (error) => {
									resolve({ label, url, statusCode: null, error: error.message });
								});
							})
						);						

                        const results = await Promise.all(requests);
                        results.forEach(({url, label, statusCode, responseTime, error }) => {
                            if (statusCode !== null) {
                                if (AllowedReturnRequest.includes(statusCode)) {
                                    if (responseTime > 2000) {
                                        if (!YellowCode.includes(label)) {
                                            const embed = new EmbedBuilder()
                                                .setColor('#f6ff00')
                                                .setTitle(`${label} API is downgrading!`)
                                                .setURL(url)
                                                .setAuthor({ name: 'Status Bot' })
                                                .addFields(
                                                    { name: 'Response Code', value: "200", inline: true },
                                                    { name: 'Response Time', value: `${responseTime} ms`, inline: true }
                                                )
                                                .setFooter({ text: 'Status Check' })
                                                .setTimestamp();

                                            channel.send({ embeds: [embed] });
                                            YellowCode.push(label);

											const index = RedCode.indexOf(label);
				
											if (index !== -1) {
												RedCode.splice(index, 1); // Remove 1 element at the found index
											}
											const index2 = GreenCode.indexOf(label);
				
											if (index2 !== -1) {
												GreenCode.splice(index2, 1); // Remove 1 element at the found index
											}
                                        }
                                    } else {
                                        if (!GreenCode.includes(label)) {
                                            const embed = new EmbedBuilder()
                                                .setColor('#00ff00')
                                                .setTitle(`${label} API is up!`)
                                                .setURL(url)
                                                .setAuthor({ name: 'Status Bot' })
                                                .addFields(
                                                    { name: 'Response Code', value: "200", inline: true },
                                                    { name: 'Response Time', value: `${responseTime} ms`, inline: true }
                                                )
                                                .setFooter({ text: 'Status Check' })
                                                .setTimestamp();

                                            channel.send({ embeds: [embed] });
                                            GreenCode.push(label);
				
											const index = RedCode.indexOf(label);
				
											if (index !== -1) {
												RedCode.splice(index, 1); // Remove 1 element at the found index
											}
											const index2 = YellowCode.indexOf(label);
				
											if (index2 !== -1) {
												YellowCode.splice(index2, 1); // Remove 1 element at the found index
											}
                                        }
                                    }
                                } else {
                                    if (!RedCode.includes(label)) {
										let CauseOfIssue = "Unknown"
										switch(statusCode) {
											case 500:
												CauseOfIssue = "Internal server error"
											  break;
											case 503:
												CauseOfIssue = "Service unavailable"
												break
											case 502:
												CauseOfIssue = "Bad Gateway"
											  break;
											case 507:
												CauseOfIssue = "Insuffient Storage"
												break
											default:
											  
										}
                                        const embed = new EmbedBuilder()
                                            .setColor('#ff0000')
                                            .setTitle(`${label} API is down!`)
                                            .setURL(url)
                                            .setAuthor({ name: 'Status Bot' })
                                            .addFields(
                                                { name: 'Response Code', value: statusCode.toString(), inline: true },
                                                { name: 'Response Time', value: `${responseTime} ms`, inline: true },
                                                { name: 'Response : ', value: CauseOfIssue, inline: true }
                                            )
                                            .setFooter({ text: 'Status Check' })
                                            .setTimestamp();

                                        channel.send({ embeds: [embed] });
                                        RedCode.push(label);

										const index = GreenCode.indexOf(label);
				
										if (index !== -1) {
											GreenCode.splice(index, 1); // Remove 1 element at the found index
										}

										const index2 = YellowCode.indexOf(label);
				
										if (index2 !== -1) {
											YellowCode.splice(index2, 1); // Remove 1 element at the found index
										}
                                    }
                                }
                            } else {
                                console.error(`${label} Error: ${error}`);
                            }
                        });
                    } catch (error) {
                        console.error(`Error making requests: ${error}`);
                    }
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
