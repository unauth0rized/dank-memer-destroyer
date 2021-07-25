module.exports = {
    minargs: 1,
    command: 'get',
    callback: async (self, message, args, text) => {
        message.channel.send(text).catch(() => { console.log })
        
    }
}