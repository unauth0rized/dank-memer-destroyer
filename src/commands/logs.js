const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const Discord = require('discord.js')
module.exports = {
    minargs: 0,
    command: 'logs',
    callback: async (self, clients, message, args, text) => {
        const attachment = new Discord.MessageAttachment(Buffer.from(global.uncaughtExceptions.join('\n\n')), "uncaughtExceptions.log");
        message.channel.send(attachment).catch(() => { console.log })
    }
}