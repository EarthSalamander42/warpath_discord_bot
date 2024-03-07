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
	const channel = client.channels.cache.get('1215237207292383302'); // Remplace avec l'ID du canal Discord
	console.log(players);

	// Make a great looking embed showing the 2 players, their steam avatar, their xp, their rank, and their winrate and their donator status
	const embedFields = [];

	// Parcours des clés de l'objet players
	for (const steamid in players) {
		if (Object.hasOwnProperty.call(players, steamid)) {
			const player = players[steamid];
			// Construction des informations pour chaque joueur
			const fieldValue = `XP: ${player.xp_in_level}/${player.xp_next_level}\n` +
							`Rank: ${player.rank_title}\n` +
							`Winrate: ${player.seasonal_winrate}\n` +
							`Donator status: ${player.status}\n\n`;

			// Ajout des informations à embedFields
			embedFields.push({ name: steamid, value: fieldValue, inline: true });
		}
	}

	// Construction de l'embed avec les informations des joueurs
	const embed = {
		color: 0x0099ff,
		title: 'Game started',
		description: `Match ID: ${match_id}`,
		fields: embedFields
	};

	// Envoi de l'embed sur le canal Discord
	if (channel) {
		channel.send({ embeds: [embed] });
	} else {
		console.log('Channel not found');
	}

	res.sendStatus(200);
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
