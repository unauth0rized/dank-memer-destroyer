class MoneyCollector {
    /**
     * 
     * @param {String} event Event name.
     * @param {AsyncFunction} callback Callback to call when event is emitted.
     * @returns {undefined} Nothing
     */
    async on(event, callback) {
        this.emitter.on(event,async () => {
            callback(...arguments);
        })
    }
    /**
     * 
     * @param {String} event Event name.
     * @param {AsyncFunction} callback Callback to call when event is emitted.
     * @returns {undefined} Nothing
     */
    async once(event, callback) {
        this.emitter.once(event,async () => {
            callback(...arguments);
        })
    }
    /**
     * 
     * @param {String} token Discord authentication token.
     * @param {Array} activeHours Active Bot hours
     * @param {String} guildId Guild id to use as farming operation
     * @param {String} ownerId Owner's id for managing the bot.
     * @returns {undefined} Nothing
     */
    constructor(token, activeHours, guildId, ownerId) {
        this.cooldown = false
        this.activeHours = activeHours
        this.guildId = guildId
        this.ownerId = ownerId
        this.lib = []
        this.lib.events = require('events')
        this.emitter = new this.lib.events.EventEmitter()
        this.ran = false
        this.lib.discord = global.Discord
        this.token = token
        this.client = new this.lib.discord.Client({ 
            _tokenType: '',
            cacheGuilds: true,
            cacheChannels: true,
            cacheOverwrites: false,
            cacheRoles: false,
            cacheEmojis: false,
            cachePresences: false
        })
        this.ready = false
    }
    /**
     * 
     * @returns {Promise} Promise 
     */
    async Run() {
        setInterval(async () => {
            if (!this.activeHours.includes(new Date().getHours())) {
                let lastValue = this.cooldown
                this.cooldown = true
                if (lastValue != this.cooldown) {
                    this.emitter.emit('cooldownChanged', true)
                }      
            } else if (this.activeHours.includes(new Date().getHours())) {
                let lastValue = this.cooldown
                this.cooldown = false
                if (lastValue != this.cooldown) {
                    this.emitter.emit('cooldownChanged', false)
                }  
            }
        }, 60 * 1000)
        if (this.ran == false) {
            await this.SetHandler('ready', async () => {
                this.ready = true
                this.emitter.emit('ready')
            })
        }
        return new Promise(async (resolve, reject) => {
            if (this.ran == false) {        
                await this.client.login(this.token).catch(async (err) => {
                    this.emitter.emit('loginError')
                   // this.client.logger.warn(this.token + " is phone locked")
                })
                resolve(this.client)
            } else {
                reject('MoneyCollector has been already started.')
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
        this.client.on(event, callback)
    }
}
module.exports = MoneyCollector