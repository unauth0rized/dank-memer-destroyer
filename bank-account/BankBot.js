const { CommandManager, CommandList } = require('./CommandManager');
const logger = require('./utility/logger')
const PersistentMessage = require('./utility/PersistentMessage')
class BankBot {
    /**
     * 
     * @param {String} event Event name.
     * @param {AsyncFunction} callback Callback to call when event is emitted.
     * @returns {undefined} Nothing
     */
    async on(event, callback) {
        this.emitter.on(event, async () => {
            callback(...arguments);
        })
    }
    async AddPersistentMessage(source, destination) {
        let tmp = new PersistentMessage(source, destination)
        this.PersistentMessages.push(tmp)
    }
    /**
     * 
     * @param {String} token Discord authentication token.
     * @param {Array} activeHours Active Bot hours
     * @param {String} guildId Guild id to use as farming operation
     * @param {String} ownerId Owner's id for managing the bot.
     * @returns {undefined} Nothing
     */
    constructor(token, ownerId) {
        this.PersistentMessages = [];
        this.ownerId = ownerId
        this.lib = []
        this.CommandList = new CommandList('./commands')
        this.CommandManager = new CommandManager(this.CommandList)
        this.lib.events = require('events')
        this.emitter = new this.lib.events.EventEmitter()
        this.ran = false
        this.lib.discord = require('discord.js')
        this.token = token
        this.client = new this.lib.discord.Client({
            _tokenType: '',
        })
        this.client.logger = logger
        this.ready = false
        this.hook = null
        this.cooldown = null
        this.client.owner = null
    }
    /**
     * 
     * @returns {Promise} Promise 
     */
    async Run() {

        if (this.ran == false) {
            this.client.on('messageUpdate', async (old, message) => {
                let flagged = this.PersistentMessages.filter((pm) => {
                    console.log('source' , pm.source.id, 'message', message.id)
                    return  pm.source.id === message.id
                })
                console.log(flagged)
                if (flagged.length == 0) {
                    return;
                }
                flagged = flagged[0]
                let attachments = await message.attachments.array()
                let tmp = []
                for (var idx of attachments) {
                    tmp.push(idx.url)
                }
                console.log
                let displayName = await message.guild.member(message.author);
                displayName = displayName.nickname || message.author.tag
                let reportTo = await this.client.channels.fetch('869126226835566622')
                let m = await reportTo.messages.fetch({ limit: 1 })
                m = m.first()

                let toSend = `**[${displayName} (${message.author.tag} | ${message.author.id})]** said on **${message.channel.name}** \n\n${message.content}`
                if (m.content.startsWith(`**[${displayName}`)) {
                    toSend = message.content
                }
                console.log('replicating message')
                flagged.destination.edit(toSend, { files: tmp, disableMentions: 'all' })
            })
            await this.client.on('message', async (message) => {
                if (message.channel.id === '715595606575284264') {
                    //anomic report
                    let attachments = await message.attachments.array()
                    let tmp = []
                    for (var idx of attachments) {
                        tmp.push(idx.url)
                    }
                    let displayName = await message.guild.member(message.author);
                    displayName = displayName.nickname || message.author.tag
                    let reportTo = await this.client.channels.fetch('869126226835566622')
                    let m = await reportTo.messages.fetch({ limit: 1 })
                    m = m.first()

                    let toSend = `**[${displayName} (${message.author.tag} | ${message.author.id})]** said on **${message.channel.name}** \n\n${message.content}`
                    if (m.content.startsWith(`**[${displayName}`)) {
                        toSend = message.content
                    }
                    let options = { files: tmp, disableMentions: 'all' }
                    let snt = await reportTo.send(toSend, options)
                    await this.AddPersistentMessage(message, snt)
                    return
                }
                this.CommandManager.Handle(this.client, message)
            })
            await this.SetHandler('ready', async () => {
                this.ready = true
                this.client.owner = await this.client.users.fetch(this.ownerId)
                this.client.logger.log("Bank Bot is ready as " + this.client.user.tag)
                this.emitter.emit('ready')
            })
        }
        return new Promise(async (resolve, reject) => {
            if (this.ran == false) {
                await this.client.login(this.token).catch(async (err) => {
                    this.client.logger.error("Bank Bot FAILED TO LOG IN QUITTING")
                    console.log(err)
                    process.exit(2)
                })
                resolve(this.client)
            } else {
                reject('Bank Bot has been already started.')
            }
        })
    }
    /**
     * 
     * @param {String} event Event to hook to. 
     * @param {AsyncFunction} callback Callback to call when event is emitted.
     * @returns {undefined} Nothing
     */
    async SetHandler(event, callback) {
        this.client.on(event, async () => {
            callback(...arguments);
        })
    }
}
module.exports = BankBot