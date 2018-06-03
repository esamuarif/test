const Discord = require("discord.js");
exports.run = async (bot, message, args) => {
 if(!message.member.roles.some(r=>["Owner", "Admin", "Moderator", "CoLeader", "Mod"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
  
  let nickname = args.join(' ')
  message.guild.members.get('452360666020577281')
  	.setNickname(nickname);
  await message.channel.send({
  	embed: new Discord.RichEmbed()

  		.setTitle(`Changed Server Nickname to ${nickname}`)
  })
} 
exports.help = { 
name: "setnick" 
} 
