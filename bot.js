const Discord = require("discord.js"); 
const PREFIX = "e!"; 

var bot = new Discord.Client(); 

bot.on("ready", function() { 
    bot.user.setGame("e!help"); 
    console.log(`${bot.user.username} Sedang ONLINE!`); 
});

//--------------------------------------------------
const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });

const youtube = new YouTube(GOOGLE_API_KEY);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
//-----------------------------------------------------------------------


bot.on("message", function(message) { 

    if (message.author.equals(bot.user)) return; 

    if (!message.content.startsWith(PREFIX)) return; 

    if (!message.guild) return
    
    var args = message.content.slice(PREFIX.length).trim().split(" ");
    var command = args.shift().toLowerCase();

    try {
        commandFile = require(`./commands/${command}.js`);
        commandFile.run(bot, message, args);
    } catch (e) {
        console.log(e.message) 
    } finally {
        console.log(`${message.author.tag} menggunakan perintah ${command}`);
    } 


        if (command == "help") { 
            var embedhelpmember = new Discord.RichEmbed() 
                .setTitle("**Bantuan Minasaki**\n") 
                .addField("General", "Command") 
                .addField(" `ping`", "Menampilkan Latency Dan API") 
                .addField(" `avatar`", "menampilkan pp atau (`avatar` @usertag)")
                .addField(" `botinfo`", "menampilkan sedikit info tentang aku") 
                .addField(" `serverinfo`", "Menampilkan Info Server Ini") 
                .addField(" `report`", "lapor member yg melanggar peraturan atau toxic") 
                .addField("Fun", "Command") 
                .addField(" `ask`", "cobalah bertanya sesuatu ke bot😉")
                .addField(" `say`", "berkatalah sesuatu, aku akan mengulaginya") 
                .addField(" `emojify`", "menampilkan kata² dengan emoji😉") 
                .addField(" `weather`", "menampilkan cuaca (`weather` lokasi)") 
                .addField("Admin", "Command")
                .addField(" `mute`", "mute seseorang di server") 
                .addField(" `warn`", "warn member yg bebal") 
                .addField(" `createinvite`", "membuat permanen invite link") 

                .setColor(0x36FF00) 
                .setFooter("Coded by @King Of Erangel✔🇲🇾🇮🇩#2769 | Created By : Sharif"); 
                message.channel.send(embedhelpmember)

    };

        if (command == "esay") {
        if(!message.member.roles.some(r=>["Owner", "Admin", "Moderator", "CoLeader", "Mod", "Developer"].includes(r.name)) )
        return message.reply("Sorry, you don't have permissions to use this!");

        const sayMessage = args.join(" ");

        let servIcon = message.guild.iconURL;
        let esayEmbed = new Discord.RichEmbed()
        .setTitle("Say")
        .setColor("#0537ff")
        .setThumbnail(servIcon)
        .setDescription(`Said by ${message.author}`)
        .addField("Message", `${sayMessage}`)
        .setTimestamp();

        const esayMessage = args.join(" ");

        message.delete().catch(O_o=>{});

        message.channel.send(esayEmbed);
    }

    if (command == "botinfo") {
        let bicon = bot.user.displayAvatarURL;
        let helpmember = new Discord.RichEmbed()   
        .setDescription("Informasi Bot")
        .setColor('RANDOM')
        .addField("Nama Bot", `${bot.user.tag}`)
        .addField("Creator", "@King Of Erangel✔🇲🇾🇮🇩#2769") 
        .addField("Dibuat Pada", `${bot.user.createdAt}`)
        .setThumbnail(bicon)
        message.channel.send(helpmember);
    };
        
        if (command == "serverinfo") {
        let sicon = message.guild.iconURL; 
            let serverembed = new Discord.RichEmbed()
            .setAuthor("Informasi Server")
            .setColor("RANDOM")
            .setThumbnail(sicon)
            .addField("📝Nama Server", message.guild.name) 
            .addField("📅Dibuat", message.guild.createdAt) 
            .addField('👥Jumlah Members', `**${message.guild.memberCount}**`, true)
            .addField('🙇🏻Humans', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
            .addField('🤖Bots', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
            .addField('Member Status', `**${message.guild.members.filter(o => o.presence.status === 'online').size}**<:online:449590947165110283> Online\n**${message.guild.members.filter(i => i.presence.status === 'idle').size}**<:away:449590947110584321> Idle/Away\n**${message.guild.members.filter(dnd => dnd.presence.status === 'dnd').size}**<:dnd:449590946879766539> Do Not Disturb\n**${message.guild.members.filter(off => off.presence.status === 'offline').size}**<:offline:449590947047669760> Offline/Invisible\n**${message.guild.members.filter(s => s.presence.status === 'streaming').size}**<:stream:449590947232350221> Streaming`)
            .addField("Kamu Join", message.member.joinedAt) 
            .setFooter(`Owner: ${message.guild.owner.user.tag}`)
    message.reply(serverembed);
    };
    
 });

 bot.on("message", async autoresponder => {
    if (autoresponder.author.bot) return;
    if (autoresponder.channel.type === "dm") return;

    let msg = autoresponder.content.toLowerCase();
    let sender = autoresponder.author;
    if (autoresponder.content.startsWith(PREFIX)) return;
     


    if (autoresponder.content === `<@${bot.user.id}>`) {
        return autoresponder.reply(' Type _**e!**_  Noob!')
    }

});

bot.login(process.env.TOKEN); 
