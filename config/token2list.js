const fs = require('fs');
class Token {
    constructor(token) {
        this.value = token
    }
}
class TokenList {
    constructor(tokens) {
        this.tokens = tokens
    }
}
let tokens = fs.readFileSync('./tokens').toString().split('\r\n');
fs.writeFileSync('./tokens',JSON.stringify(tokens))