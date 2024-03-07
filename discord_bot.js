const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const config = require('./config.json');

const app = express();
const port = 3000;

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		// GatewayIntentBits.GuildMembers,
		// GatewayIntentBits.MessageContent,
	]
});

const token = config.token; // Remplace avec ton propre token Discord

app.use(bodyParser.json());

app.post('/game-start', (req, res) => {
	const { players, match_id } = req.body;

	console.log(players);
	console.log(match_id);

	// Envoie une notification sur le serveur Discord
	// const channel = client.channels.cache.get('1215237207292383302'); // Remplace avec l'ID du canal Discord

	// if (channel) {
	// 	channel.send(`Une nouvelle partie a commencé avec les joueurs suivants : ${players.join(', ')}`);
	// } else {
	// 	console.log('Channel not found');
	// }

	res.sendStatus(200);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
