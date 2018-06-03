const Discord = module.require("discord.js");

module.exports.run = async (bot, message, args) => {
        let apiKey = "590a7c51bf89725644d211b87dfb62c3";
        const fetch = require('node-fetch');
        let arg = message.content.split(' ').join(' ').slice(10);
        if (!arg) {
            return message.reply('I need a city to check :wink:');
        }
        fetch('http://api.openweathermap.org/data/2.5/weather?q=' + arg + '&APPID=' + apiKey + '&units=metric')
            .then(res => {
                return res.json();
            }).then(json => {
                if (json.main === undefined) {
                    return message.reply(`**${arg}** Isnt inside my query, please check again`);
                }
                let rise = json.sys.sunrise;
                let date = new Date(rise * 1000);
                let timestr = date.toLocaleTimeString();
                let set = json.sys.sunset;
                let setdate = new Date(set * 1000);
                let timesstr = setdate.toLocaleTimeString();
                const embed = new Discord.RichEmbed()
              .setColor(3447003)
              .setTitle(`Region: 🌎 **${json.name}**`)
                .addField("**Humidity:**", `${json.main.humidity}%`, true)
                .addField("**⏱ Temp:**", `${json.main.temp}°C`, true)
                .addField("**☁ WindSpeed:**", `${json.wind.speed}m/s`, true)
                .addField("**🌅 Sunrise:**", `${timestr}`, true)
                .addField("**🌇 Sunset:**", `${timesstr}`, true)
                .setTimestamp()
                .setFooter(`Executor : ${message.author.username}#${message.author.discriminator}`)
                message.channel.send({embed})
              .catch(console.error);
            }).catch(err => {
                if (err) {
                    message.channel.send('Something went wrong while checking the query!');
                }
            });

}

module.exports.help = {
    name: "weather"
  }
