const { Module } = require('module')
const { relativeTimeThreshold } = require('moment')

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
    StringToBoolean(string) {
        if (string.includes('no') || string.includes('n')) {
            return false
        }
        if (string.includes('yes') || string.includes('y')) {
            return true
        }
        return false //failsafe
    }
    async Handle(client, message){
        let { content, channel } = message
        if (this.ClientManager.ManagerBot.ready === false) {
            channel.send('Bot is still loading, don\'t try to break it.')
            return
        }
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
            if (message.author.id !== '810573719222747158' /* this.ClientManager.ownerId*/) {
                const snt = await message.channel.send("Asking for authorization to owner..")
                const snt2 = await message.channel.send(`<@${client.owner.id}> ${message.author.tag} wants to run "${"# " + cmd + " " + arg.join(' ') }", allow?`)
                snt.edit('Waiting for authorization from owner..')
                let aw = await snt2.channel.awaitMessages(m => m.author.id === client.owner.id ,  { max: 1, time: 100000, errors: ['time'] }).catch(() => {})
                aw = aw.first()
                if (aw === undefined) {
                   snt.edit('Failed to authorize command request, try again later.')
                   return
                }
               
                let {content} = aw
                content = content.toLowerCase()
                let auth = this.StringToBoolean(content)
                if (auth) {
                    snt.edit('Owner authorized you.')
                }
                else {
                    snt.edit('Owner did not authorize you.')
                    return
                }
            }
            handler.callback(client, this.Clients, message, arg, arg.join(' '))
        }
    }
}

module.exports = {
    CommandList: CommandList,
    CommandManager: CommandManager
}