const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
 const embed = new Discord.RichEmbed()
    .setAuthor("Invite To Play With Me :")
    .setColor(0xf44336)
    .addField("Invite Me !", "[Click Here](https://discordapp.com/oauth2/authorize?client_id=452360666020577281&scope=bot)", true)
    .setFooter("Terima kasih | Created By Sharif");
  message.channel.send({
    embed
  });
} 

exports.help = { 
name: "invbot" 
} 
