const tmi = require('tmi.js');
require('dotenv').config();

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

let maxBeverages = 12;
let beverageName = 'juguito naturas';
let beverageNamePlural = 'juguitos naturas';
let beveragesCount = maxBeverages;

const commands = {
    '!projecto': 'Hacer un blockchain de cero',
    '!refresco': (context) => {
        let msg = '';
        if (beveragesCount > 0) {
            msg = `${context['display-name']} se agarro un ${beverageName} en la refri. Ya solo quedan ${--beveragesCount}.`;
        } else {
            msg = `${context['display-name']} quiso agarrar un ${beverageName}. Pero ya no hay en la refri!
                escribe !refill para refilear.`
        }

        return msg;
    },
    '!refill': (context) => {
        beveragesCount = maxBeverages;
        return `${context['display-name']} reprovisiono la refri de ${beverageNamePlural}!`;
    }
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    const commandName = msg.trim();

    if (commands[commandName]) {
        if (commands[commandName] instanceof Function) {
            client.say(target, commands[commandName](context));
        } else {
            client.say(target, commands[commandName]);
        }

        console.log(`Executed ${commandName} command`);
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
