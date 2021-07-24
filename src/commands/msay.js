const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
module.exports = {
    minargs: 1,
    command: 'msay',
    callback: async (self, clients, message, args, text) => {
        message.channel.send(text).catch(() => { console.log })
    }
}