// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const https = require('https');
const port = 8080;

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
    ["Badge","https://apis.roblox.com/legacy-badges"],
    ["Client Information", "https://clientsettings.roblox.com/v2/user-channel"],
    ["Economics", "https://economy.roblox.com/v1/user/currency"],
    ["Game Join", "https://gamejoin.roblox.com/v1/metadata"],
    ["Avatar", "https://avatar.roblox.com/v1/avatar/metadata"],
    ["Catalog", "https://catalog.roblox.com//v1/users/1/bundles"],
    ["Game Internationalization", "https://gameinternationalization.roblox.com/v2/supported-languages/games/4924922222"],
    ["Presense (User)", "https://presence.roblox.com/v1/presence/users"],
    ["Trade","https://trades.roblox.com/v1/trades/metadata"],
];

const AllowedReturnRequest = [
    200,
    404,
    429,
    401,
    405,
]

var GreenCode = []
var YellowCode = []
var RedCode = []


const token  = process.env['Token'];


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in : ${readyClient.user.tag}`);
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
				if (Array.isArray(HTTPS) && HTTPS.length > 0) {
					HTTPS.forEach(([label, url]) => {
						const responseTimer = Date.now();
						https.get(url, (response) => {
							if (AllowedReturnRequest.indexOf(response.statusCode) >= 0) {
								const responseTime = Date.now() - responseTimer;

								if(GreenCode.indexOf(label) < 0) {
									const embed = new EmbedBuilder()
									.setColor('#0099ff') // Set the color of the embed
									.setTitle(`${label} is up!`)
									.setURL(url) // URL for the title
									.setAuthor({ name: 'Status Bot'}) // Author
									//.setDescription('A Service is down!') // Description
									.addFields(
										{ name: 'Response Code', value: response.statusCode, inline: true },
										{ name: 'Response Time', value: responseTime, inline: true }
									)
									.setFooter({ text: 'Footer text here' }) // Footer
									.setTimestamp(); // Add a timestamp

									channel.send({ embeds: [embed] })

									const index1 = RedCode.indexOf(label);

									// If "green" is found in the array
									if (index1 !== -1) {
									  // Remove "green" using splice
									  RedCode.splice(index1, 1);
									}

									const index2 = YellowCode.indexOf(label);

									// If "yellow" is found in the array
									if (index2 !== -1) {
									// Remove "Yellow" using splice
									YellowCode.splice(index2, 1);
									}

									GreenCode.push(label);
								}
								console.log(`[${label}] Request successful, Response 200, Response time ${responseTime} ms`)
							} else {

								if(RedCode.indexOf(label) < 0) {
									const embed = new EmbedBuilder()
									.setColor('#0099ff') // Set the color of the embed
									.setTitle(`${label} is down!`)
									.setURL(url) // URL for the title
									.setAuthor({ name: 'Status Bot'}) // Author
									//.setDescription('A Service is down!') // Description
									.addFields(
										{ name: 'Response Code', value: response.statusCode, inline: true },
										{ name: 'Response Time', value: responseTime, inline: true }
									)
									.setFooter({ text: 'Footer text here' }) // Footer
									.setTimestamp(); // Add a timestamp

									channel.send({ embeds: [embed] })

									const index1 = GreenCode.indexOf(label);

									// If "green" is found in the array
									if (index1 !== -1) {
									  // Remove "green" using splice
									  GreenCode.splice(index1, 1);
									}

									const index2 = YellowCode.indexOf(label);

									// If "yellow" is found in the array
									if (index2 !== -1) {
									// Remove "Yellow" using splice
									YellowCode.splice(index2, 1);
									}

									RedCode.push(label);
								}

								console.log(`[${label}] Request unsuccessful, Response ${response.statusCode}, Response time ${responseTime}`)
							}
				
						}).on('error', (error) => {
							console.error(`${label} Error: ${error.message}`);
						});
					});
				} else {
					console.error('HTTPS array is not defined or empty.');
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