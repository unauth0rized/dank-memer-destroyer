const { Module } = require('module')

class CommandList {
    constructor(directory) {
        let modules = []
        require('fs').readdirSync(directory).forEach((path) => {
            modules.push(require(`${directory}/${path}`))
        })
        
        this.Commands = modules
        return modules
    }
    async GetCommands() {
        return this.Commands
    }
}
class CommandManager {
    /**
     * 
     * @param {CommandList} CommandList 
     */
    constructor(CommandList, ClientManager) {   
        this.Commands = CommandList
        this.ClientManager = ClientManager
        setInterval(() => {
            this.Clients = ClientManager.Workers
        }, 100);
        this.Clients = ClientManager.Workers //.filter(async ({guilds}) => guilds !== undefined)
        this.logger = require('./utility/logger')
    }
    async Handle(client, message){
        let { content, channel } = message
        if (content.startsWith('# ')) {
            //Actual managment command.
            this.logger.cmd('"' + content + '"' + "\t(" + message.author.tag + ")")
            const arg = content.split(/[ ]+/)
            arg.shift()
            const cmd = arg.shift()
            let matchingHandlers = this.Commands.filter(( { command } ) => command.toLowerCase().startsWith(cmd.toLowerCase()))
            if (matchingHandlers.length == 0) {
                message.channel.send("Hmm, seems like that command doesn't exist.")
                return
            }
            let handler = matchingHandlers[0]
            if (arg.length < handler.minargs) {
                message.channel.send("Hey! seems like you need **" + (handler.minargs - arg.length).toString() + "** more arguments" )
                return
            }
            if (message.author.id !== this.ClientManager.ownerId) {
                message.channel.send("you need to be authorized to run this command!")
                return
            }
            handler.callback(client, this.Clients, message, arg, arg.join(' '))
        }
    }
}

module.exports = {
    CommandList: CommandList,
    CommandManager: CommandManager
}