const Proxy = require("./Proxy")
const Axios = require("axios")
class ProxySet {
    constructor(ProxyList) {
        this.Proxies = []
        ProxyList.forEach((prxy) => {
            let tmp = new Proxy(prxy)
            this.Proxies.push(tmp)
        })
    }
    async Get() {
        return this.Proxies
    }
}
class ProxyChecker {
    constructor() {
        
    }
    async CheckProxy(proxy) {
        proxy = new Proxy(proxy)
        const axios = require('axios');
        const SocksProxyAgent = require('socks-proxy-agent'); 
        const proxyHost = await proxy.GetIP()
        const proxyPort = await proxy.GetPort()
        const proxyOptions = {host: 'socks4://' + proxyHost, port: proxyPort}
        const baseUrl = ''

        const httpsAgent = new SocksProxyAgent(proxyOptions);

        const client = axios.create({undefined, httpsAgent});

       
        let success = false
        try {
            let tmp = await client.get('http://api.ipify.org/', {proxy: { host: 'socks4://' + proxyHost, port: proxyPort}})
            console.log(tmp.data)
            success = true
        }
        catch(e) {
            success = false
            console.log(e)
        }
        console.log(success)
        return success
    }
    async CheckProxies(Proxies){
        console.log(Proxies.length)
        let working = []
        Proxies.forEach(proxy => {
            if (this.CheckProxy(proxy)) working.push(proxy);
        }) 
        return working
    }
}
module.exports = {
    ProxySet: ProxySet,
    ProxyChecker: ProxyChecker
}