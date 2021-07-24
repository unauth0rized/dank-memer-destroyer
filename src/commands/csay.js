const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
module.exports = {
    minargs: 2,
    command: 'csay',
    callback: async (self, clients, message, args, text) => {
        text = text.replace(`<@!${message.mentions.members.first().id}>`,'')
        /*console.log(text)
        console.log(message)*/
        const cclient = clients.filter(({client}) => {
            //console.log(message.mentions.members.first().id)
            
            if (!client.user) return;
            //console.log(client)
            return client.user.id === message.mentions.members.first().id
        })
        message.mentions.members.first().id
        cclient[0].client.guilds.cache.get(message.guild.id).channels.cache.get(message.channel.id).send(text)
    }
}