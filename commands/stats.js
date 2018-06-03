const run = module.exports.run = async (client, msg, args) => {
    const info = [
        '__**minasaki** Info__',
        '',
        'Fire is in a few discord guilds!',
        '',
        `• Now i in  **${client.guilds.size}**  guilds🤗.`,
        `• Stanby in **${client.channels.size}** channels.`,
        `• Playing with **${client.users.size}** other users.`
    ].join('\n');
    msg.channel.send(info);
}

const meta = module.exports.meta = {
    aliases: ['servers'],
    ownerOnly: false,
    description: 'bot server info',
    usage: ''
}
