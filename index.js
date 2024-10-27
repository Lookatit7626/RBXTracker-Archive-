// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
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


const token  = process.env['Token'];


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

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
            channel.send('Hello, this is a message from my bot!')
                .then(() => console.log('Message sent!'))
                .catch(console.error);
        } else {
            console.log('Channel not found!');
        }
    } else {
        console.log('Guild not found!');
    }
});

// Log in to Discord with your client's token
client.login(token);