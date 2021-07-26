module.exports = {
    minargs: 1,
    command: 'say',
    callback: async (self, message, args, text) => {
        message.channel.send(text).catch(() => { console.log })
    }
}