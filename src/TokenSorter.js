const discord = require('discord.js')
const sleep = async (milliseconds) => {
    return new Promise((resolve, reject) => {setTimeout(resolve, milliseconds)})
}
class AwaitGuilds {
    constructor(token) {
        this.ready = false
        this.client = new discord.Client({ _tokenType: ''})
        this.client.on('ready', () => {this.ready = true})
        this.client.login(token)
        do {
            await sleep(1000)
        }while (!this.ready)
        const guilds = this.client.guilds.cache
        this.client.logout()
        return guilds
    }
}
class SortedTokens {
    constructor(tokens, guildId) {
        this.tokens = tokens;
        this.guildId = guildId;
    }
}
class TokenSorter {
    /**
     * 
     * @param {Array} tokens Array containing authentication tokens.
     * @param {Function} filter Filter which each guild will be applied to.
     */
    constructor(tokens, filter) {
        this.tokens = tokens
        this.sorted_tokens = {}
        this.filter = filter
    }
    async Sort() {

        this.tokens.forEach((token) => {
            const guilds = new AwaitGuilds(token)
            console.log(guild)
        })
    }
}