class Proxy {
    constructor(URI) {
        this.uri = URI
        let tmp = URI.split(':')
        this.ip = tmp[0]
        this.port = tmp[1]
    }
    async GetURI() {
        return this.uri
    }
    async GetPort() {
        return this.port
    }
    async GetIP() {
        return this.ip
    }
}

module.exports = Proxy