const Discord = module.require("discord.js");

exports.run = async (bot, message, args) => {

const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
  let avatarembed = new Discord.RichEmbed()
  .setColor(3447003)
  .setAuthor(member.user.tag)
  .setImage(member.user.displayAvatarURL);

   message.channel.send(avatarembed);

 }

exports.help = {
     name: "avatar"
   }
