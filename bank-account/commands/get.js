const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
module.exports = {
    minargs: 1,
    command: 'get',
    callback: async (self, message, args, text) => {
        let trg = message.mentions.users.first() || message.author
        const coins = parseInt(args[0])
        let snt1 = await message.channel.send('Alright, trying to give ' + coins.toString() + ' coins to <@' + trg.id + '>').catch(() => { console.log })
        let snt2 = await message.channel.send(`pls give ${coins} <@${trg.id}>`)
        let recv1 = await snt2.channel.awaitMessages(m => m.author.id === '270904126974590976' ,  { max: 1, time: 5000, errors: ['time'] }).catch(() => {})
        await sleep(5000)
        recv1.first().delete()
        snt1.delete()
        snt2.delete()
        message.delete()
        
    }
}