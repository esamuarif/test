const Discord = require("discord.js");

exports.run = async (bot, message, args, color, prefix) => {
    if (message.author.id !== '442943210092888065' && message.author.id !== '444454206800396309') return;
    try {
        let codein = args.join(" ");
        let code = eval(codein);

        if (typeof code !== 'string')
            code = require('util').inspect(code, { depth: 0 });
        let embed = new Discord.RichEmbed()
        .setAuthor('Evaluate')
        .setColor(color)
        .addField('📥 Input', `\`\`\`js\n${codein}\`\`\``)
        .addField('📤 Output', `\`\`\`js\n${code}\n\`\`\``)
        message.channel.send(embed)
    } catch(e) {
        message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
}

exports.help = {
    name: 'eval',
    aliases: ['ev'],
    description: 'only my onwer can use this command',
    usage: '{prefix}eval [some javascript code]'
}
