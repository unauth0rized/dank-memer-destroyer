const Proxy = require('./Proxy')
const express = require('express')
const PC = require('./ProxyChecker').ProxyChecker
let ProxyList = require('fs').readFileSync(__dirname + "/../../config/socks4_proxies.txt").toString().split('\r\n')
const ProxyChecker = new PC()
ProxyChecker.CheckProxies(ProxyList).then(console.log)

//https://api.proxyscrape.com/v2/?request=getproxies&protocol=socks4&timeout=10000&country=all

/*let Proxies = []
let working = []
async function Translate(Proxy) {
    return { host: await Proxy.GetIP(), port: await Proxy.GetPort(), proxyAuth: '' }
}
ProxyList.forEach(async (proxy) => {
    Proxies.push(Translate(new Proxy(proxy)))
})
async function main() {
    Proxies.forEach(async (proxy) => {
        let success = false
        //try {
           success = await proxy_check(proxy).catch(()=>{})
           console.log(await proxy_check(proxy).catch(console.log))
       // }
        //catch {
            
        //}
        if (success) working.push(proxy)
    })
    
}
main()*/