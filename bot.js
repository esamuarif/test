const Discord = require("discord.js"); 
const PREFIX = "e!"; 

var bot = new Discord.Client(); 

bot.on("ready", function() { 
    bot.user.setGame("e!help"); 
    console.log(`${bot.user.username} Sedang ONLINE!`); 
});

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
     
     var eightball = [
      "**Yes.**",
      "**No.**",
      "**Maybe?.**",
      "**Very likely.**",
      "**Probably not.**",
      "**😇Only God knows.**",
      "**🙄Hmmm...**",
      "**😆, What is your question?**",
  ];

    if (autoresponder.content === `<@${bot.user.id}>`) {
        return autoresponder.reply(eightball[Math.floor(Math.random() * eightball.length).toString(16)]);
        else message.channel.send("🙄**Hmmm... |** `Please Type : l!ask [question]>`");
    }

});

bot.login(process.env.TOKEN); 
