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

const donator_status = {
	100: 'Owner',
	101: 'Lead-Dev',
	102: 'Administrator',
	103: 'Alpha-Tester',
	1: 'Bronze donator',
	2: 'Silver donator',
	3: 'Golden donator',
	4: 'Platinum donator',
}

function getDonatorStatus(status) {
	return donator_status[status] || 'None';
}

function getPlayerWinrate(winrate) {
	if (winrate && typeof(winrate) == "number" && parseFloat(winrate) > 0) {
		return winrate.toFixed(2) + '%';
	} else {
		return 'N/A';
	}
}

const token = config.token; // Remplace avec ton propre token Discord

app.use(bodyParser.json());

app.post('/game-start', (req, res) => {
	console.log('Received a game start request');
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
			const fieldValue = `Level ${player.xp_level} (${player.xp_in_level}/${player.xp_next_level} xp)\n` +
							`Rank: ${player.rank_title + " (" + player.rank_id + ")"}\n` +
							`Winrate: ${getPlayerWinrate(player.winrate_toggle)}\n` +
							`Donator status: ${getDonatorStatus(player.status)}\n\n`;

			// Ajout des informations à embedFields
			embedFields.push({ name: player.personaname + " (" + steamid + ")", value: fieldValue, inline: true });
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
