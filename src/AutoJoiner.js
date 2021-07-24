const axios = require('axios');
class AutoJoiner  {
    /**
     * 
     * @param {Array} tokens Discord authentication tokens.
     * @param {Array<Proxy>} ProxySettings Proxy array object 
     */
    constructor(tokens, ProxySettings) {
        
        this.lib = []
        this.lib.event = require('event')
        this.emitter = new this.lib.event.EventEmitter()
        this.tokens = tokens
        this.ProxySettings = ProxySettings || await axios.get('https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000&country=all')
    }
    /**
     * 
     * @param {String} event 
     * @param {AsyncFunction} handler 
     */
    async on(event, handler) {
        this.emitter.on(event, handler)
    }
    
    async JoinAll() {

    }
}
module.exports = AutoJoiner