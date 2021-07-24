const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
module.exports = {
    minargs: 0,
    command: 'wid',
    callback: async (self, clients, message, args, text) => {
        message.channel.send(text).catch(() => { console.log })
        await clients.forEach(({ client }) => {
            if (client.guilds == undefined) return;
            let guild = client.guilds.cache.get(message.guild.id)
            if (!(guild == undefined)) {
                guild.channels.cache.get(message.channel.id).send("pls give <@" + message.author.id + "> all")
            }
            sleep(1000)
        })
    }
}