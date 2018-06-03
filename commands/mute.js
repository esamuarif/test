const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
          if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.sendMessage("Sorry, You don't have permissions.");

            let mtReason = args.join(" ").slice(22);

          let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
          if(!toMute) return message.channel.sendMessage("Can't find user!.");

          let role = message.guild.roles.find(r => r.name === "andin-muted");
          if(!role) {
              try {
                  role = await message.guild.createRole({
                      name: "andin-muted",
                      color: "000000",
                      permissions: []
                  });

                  message.guild.channels.forEach(async (channel, id) => {
                      await channel.overwritePermissions(role, {
                          SEND_MESSAGES: false,
                          ADD_REACTIONS: false
                      });
                  });
              } catch(e) {
                  console.log(e.stack);
              }
          }

          if(toMute.roles.has(role.id)) return message.channel.sendMessage("This user is already mute!");

          let muteembed = new Discord.RichEmbed()
          .setColor(3447003)

          .setTimestamp()
          .addField("✔️ Succed Muted!", toMute)
          .addField("Reason »", mtReason)
          .setFooter(`Executor : ${message.author.username}#${message.author.discriminator}`);

          await toMute.addRole(role);

          let modlog = message.guild.channels.find(`name`, "audit-log");
          if(!modlog) return message.channel.send("Can't Find audit-log channel.");

          modlog.send(muteembed);

}

module.exports.help = {
    name: "mute"
  }
