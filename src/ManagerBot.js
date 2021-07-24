class ManagerBot {
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
     * @param {String} token Discord authentication token.
     * @param {Array} activeHours Active Bot hours
     * @param {String} guildId Guild id to use as farming operation
     * @param {String} ownerId Owner's id for managing the bot.
     * @returns {undefined} Nothing
     */
    constructor(token, clients, ownerId, activeHours) {
        this.clients = clients
        this.ownerId = ownerId
        this.activeHours = activeHours
        this.lib = []
        this.lib.events = require('events')
        this.emitter = new this.lib.events.EventEmitter()
        this.ran = false
        this.lib.discord = require('discord.js')
        this.token = token
        this.client = new this.lib.discord.Client({ _tokenType: '' })
        this.ready = false
        this.hook = null
        this.cooldown = null
    }
    /**
     * 
     * @returns {Promise} Promise 
     */
    async Run() {
        
        if (this.ran == false) {
            await this.SetHandler('ready', async () => {
                this.ready = true
                console.log("Manager Bot is ready as", this.client.user.tag)
                this.emitter.emit('ready')
            })
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
            }, 60 * 10)
        }
        return new Promise(async (resolve, reject) => {
            if (this.ran == false) {        
                await this.client.login(this.token).catch(async () => {
                    this.client.logger.error("Manager Bot FAILED TO LOG IN QUITTING")
                    process.exit(2)
                })
                let Discord = require('discord.js')
                this.hook = new Discord.WebhookClient('867880488760115210', 'ZN8zb2pOv-lh47PXzYaVN2agclmkWSPPy7NTLDS44fDlJjuu8895x8J8uVG6ketmXknX');
                this.on("cooldownChanged", async (state) =>{
                    this.hook.send("Cooldown state changed to" + state.toString())
                })
                resolve(this.client)
            } else {
                reject('ManagerBot has been already started.')
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
module.exports = ManagerBot