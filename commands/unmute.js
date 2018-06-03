const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Sorry, You don't have permissions.");
            let udReason = args.join(" ").slice(22);

            let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
            if(!toMute) return message.channel.sendMessage("Can't find user!.");

            let role = message.guild.roles.find(r => r.name === "andin-muted");

            if(!role || !toMute.roles.has(role.id)) return message.channel.sendMessage("This user is already mute!");

            let unmuteembed = new Discord.RichEmbed()
            .setColor(3447003)

            .addField("✔️ Succed Unmuted!", toMute)
            .addField(`Reason »`, udReason)
            .setTimestamp()
            .setFooter(`Executor : ${message.author.username}#${message.author.discriminator}`);

            if(!udReason) return message.channel.sendMessage("Please take a reason!...... ")

            await toMute.removeRole(role);

            let modlog = message.guild.channels.find(`name`, "audit-log");
            if(!modlog) return message.channel.send("Can't Find audit-log channel.");

            modlog.send(unmuteembed);

}

module.exports.help = {
    name: "unmute"
  }
