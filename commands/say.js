const Discord = module.require("discord.js");

exports.run = async (bot, message, args) => {
      let saying = args.join(" ");
      if(!saying) return message.reply(`please, give me a text`)
      message.channel.send(saying);

}

exports.help = {
    name: "say"
  }
