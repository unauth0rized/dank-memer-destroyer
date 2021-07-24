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
        const baseUrl = 'https://api.ipify.org'

        const httpsAgent = new SocksProxyAgent(proxyOptions);

        const client = axios.create({baseUrl, httpsAgent});

       
        let success = false
        try {
            client.get('/').catch
            success = true
        }
        catch {
            success = false
        }
        console.log('success')
        return success
    }
    async CheckProxies(Proxies){
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