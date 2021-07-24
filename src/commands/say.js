const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
module.exports = {
    minargs: 1,
    command: 'say',
    callback: async (self, clients, message, args, text) => {
        message.channel.send(text).catch(() => { console.log })
        await clients.forEach(({ client }) => {
            if (client.guilds == undefined) return;
            let guild = client.guilds.cache.get(message.guild.id)
            if (!(guild == undefined)) {
                guild.channels.cache.get(message.channel.id).send(text)
            }
        })
        global.uncaughtExceptions.push(JSON.stringify(clients))
    }
}