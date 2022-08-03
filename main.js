const { token } = require('./config.json');
const { Client, VoiceChannel, Intents, GuildMember } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const PREFIX = '$';

const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const q = [];
let currentSong = "";
const player = createAudioPlayer();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', message => {
	let args = message.content.substring(PREFIX.length).split(" ");
	
	switch (args[0]) {
		case 'play':
			if (!args[1]) {
				message.channel.send("No link was provided.");
				return;
			} else if (!message.member.voice.channel) {
				message.channel.send("You need to join a voice channel before using that command.");
				return;
			} else {
				const connection = joinVoiceChannel({
					channelId: message.member.voice.channel.id,
					guildId: message.channel.guild.id,
					adapterCreator: message.channel.guild.voiceAdapterCreator,
				});
				currentSong = args[1];
				const stream = ytdl(args[1], {filter: "audioonly"});
				const resource = createAudioResource(stream);
				player.play(resource);
				connection.subscribe(player);
				return;
			}
		case 'skip':
			if (q.length==0) {
				player.stop();
				return;
			}
			return;
		case 'stop':
			player.stop();
			return;
		case 'queue':
			ytdl.getInfo(currentSong).then(info => {
				message.channel.send(info.videoDetails.title);
			})
			return;
	}
})

    
client.login(token);