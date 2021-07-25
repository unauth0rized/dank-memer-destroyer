const discord = global.Discord || require('discord.js')
const logger = require('./logger')
const sleep = (milliseconds) => {
    return new Promise((resolve, reject) => { setTimeout(resolve, milliseconds) })
}
class SortedTokens {
    constructor(tokens, guildId) {
        this.tokens = tokens;
        this.guild = guildId;
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
        this.sorted_tokens = []
        this.filter = filter
    }
    async AwaitGuilds(token) {
        let errored = false
        let ready = false
        let client = new discord.Client({ _tokenType: '' })
        client.on('ready', () => { /*logger.debug(`${client.user.tag}'s guilds successfully fetched!`);*/ready = true })
        client.login(token).catch(() =>  {} /*logger.warn(token + ' is phone locked.')*/)
        do {
            await sleep(1000)
            //logger.log('Awaiting guilds for ' + token + '\t' + ready)
        } while (ready == false)
        const guilds = client.guilds.cache
        client.destroy()
        return guilds
    }
    async Sort() {
        let done = false
        let lastidx = 0
        this.tokens.forEach(async (token, idx) => {
            //console.log(token, idx)
            lastidx = idx
            //console.log(idx, this.tokens.length - 1)
            let guilds = await this.AwaitGuilds(token)
            guilds.sweep((g) => g.ownerID !== "852677579827314708")
            //guilds = Array.from(guilds)//.filter(this.filter)
            //console.log(guilds.first())
            //console.log(guilds) 
            //return
            //if (!guilds[0]) return;
            //const guild = guilds[0]
            const guild = guilds.first()
            if (this.sorted_tokens[guild.id] === undefined) {
                this.sorted_tokens[guild.id] = new SortedTokens([token],guild)
            }
            else {
                this.sorted_tokens[guild.id].tokens.push(token)
            }
            if (idx >= (this.tokens.length - 5)) done = true;
        })
        logger.log('Initialization sequence: Awaiting guilds for ' + this.tokens.length + ' tokens.')
        do {
            //if (lastidx >= (this.tokens.length - 5)) done = true;
            await sleep(1000)
        }
        while(!done)
        logger.log('Initialization sequence: Successfully fetched guilds for ' + this.tokens.length + ' tokens.')
        const converted_object = [];
        Object.keys(this.sorted_tokens).forEach(key => converted_object.push({
            id: key,
            data: this.sorted_tokens[key]
        }));
        return converted_object;
    }
}

module.exports = {
    TokenSorter: TokenSorter
}