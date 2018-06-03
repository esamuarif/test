const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
          let wUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
              if(!wUser) return message.channel.send("Can't find user!");
              let wReason = args.join(" ").slice(22);
              if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No Can Do!");

          message.delete()
          let bicon = bot.user.displayAvatarURL;
          let warningajaembed = new Discord.RichEmbed()
          .setColor(3447003)
          .setThumbnail(bicon)

          .setDescription("**WARNED**")
          .addField("**By:**", `${message.author}`)
          .addField("Reason", wReason)
          .setTimestamp();

        return message.guild.member(wUser).sendMessage(warningajaembed) + message.channel.send(`**✔️ SUCCED WARNED ${message.guild.member(wUser)}** `);

        let modlog = message.guild.channels.find(`name`, "audit-log");
        if(!modlog) return message.channel.send("Can't Find audit-log channel.");

        modlog.send(warningajaembed);

}

module.exports.help = {
    name: "warn"
  }
