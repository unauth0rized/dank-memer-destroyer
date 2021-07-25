const TokenSorter = require('./utility/TokenSorter').TokenSorter
const ClientManager = require('./ClientManager') 
const logger = require('./utility/logger')
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}
class ServerManager {
    constructor(tokens, activeHours, ownerId) {
        this.ownerId = ownerId || "852677579827314708"
        this.filter = g => g.channels.cache.find(c => c.name === 'template')
        this.sorter = new TokenSorter(tokens, this.filter)
        this.sorted_tokens = []
        this.activeHours = activeHours;
        this.ClientManagers = [];
        this.sorted = false
    }
    async Sort() {
        this.sorted = true;
        this.sorted_tokens = await this.sorter.Sort();
        this.sorted_tokens.forEach((sorted) => {
            logger.debug('Spawning new instance of ClientManager')
            let client = new ClientManager(sorted.data.tokens, this.activeHours, sorted.id, this.ownerId)
            this.ClientManagers.push(client)
        })
        await sleep(10000)
        logger.debug(JSON.stringify(this.ClientManagers))
    }
    async SetupWorkership() {
        this.ClientManagers.forEach((cm, idx) => {
            logger.log(`Setting up worker ${idx}`)
            cm.SetupWorkership()
        })
    }
    async StartWorkership() {
        this.ClientManagers.forEach((cm, idx) => {
            logger.log(`Waking up worker ${idx}`)
            cm.StartWorkership()
        })
    }
    

}

module.exports = ServerManager