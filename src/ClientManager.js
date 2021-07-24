const MoneyCollector = require('./MoneyCollector');
const Axios = require('axios');
const { CommandManager, CommandList } = require('./CommandManager');
const ManagerBot = require('./ManagerBot')
const CMDManager = null;
const Parser = require("./TriviaParser")
const logger = require('./utility/logger')

class ClientManager {
  /**
    * @param {Array} activeHours Active Bot hours
    * @param {String} guildId Guild id to use as farming operation
    * @param {String} ownerId Owner's id for managing the bot
    * @param {Array} tokens Token 
   */
  constructor(tokens, activeHours, guildId, ownerId) {
    if (!(tokens.length >= 1)) {
      throw new Error('You must at least supply 1 token.')
    }
    
    this.ManagerToken = undefined
    this.CommandManager = null
    this.activeHours = activeHours
    this.guildId = guildId
    this.ownerId = ownerId
    this.Workers = []
    this.tokens = [...new Set(tokens)]
  }
  async SetupWorkership() {
    this.ManagerToken = this.tokens[0]
    this.tokens.forEach(async (token) => {
      if (token == this.ManagerToken) { return; }
      let Worker = new MoneyCollector(token, this.activeHours, this.guildId, this.ownerId)
      this.Workers.push(Worker)
      Worker.filter = null
      const { client } = Worker
      client.logger = logger
      Worker.SetHandler('ready', async () => {
        //global.hook.send(client.user.tag + ' \'Ready\' event emitted.')
       // client.user.setUsername(client.user.id)
        Worker.client.logger.ready(client.user.tag + ' is ready.')
        if (client.guilds.cache.get(this.guildId) == undefined) {
          console.log(client.user.tag, "Not in server.")
          return
          //Add proxy here
          //await Axios.post('https://discordapp.com/api/v9/invites/jdvGWps7BX', "", {headers: {'Authorization': client.token}})
        }
        Worker.channel = client.guilds.cache.get(this.guildId).channels.cache.find(c => c.name == client.user.id)
        if (Worker.channel === undefined) {
          let template = client.guilds.cache.get(this.guildId).channels.cache.find(c => c.name == "template")
          Worker.channel = await template.clone(undefined, true, true, client.user.id)
          Worker.channel.setName(client.user.id)
        }
        
      })
      Worker.SetHandler('message', async (message) => {
        if (Worker.cooldown) return;
        if (message.author.bot && message.embeds.length > 0 && message.embeds[0].description && message.embeds[0].description.includes("to answer with the correct letter") && message.embeds[0].author.name.includes(Worker.client.user.username) && message.channel.id === Worker.channel.id) {
          var question = await Parser.get_question(message.embeds[0])
          var answer = await Parser.get_answer(question, message)
          message.channel.send(answer)
        }



      })
      setInterval(async () => {
        try {
          if (Worker.cooldown) return;
          Worker.channel.send(['pls triv', 'pls trivia'][Math.floor(Math.random() * 2)])
          Worker.client.sweepMessages(30)
          const message = Worker.channel.awaitMessages(Worker.filter, { max: 1, time: 10000, errors: ['time'] }).catch(Worker.client.logger.error).then(m => m.first())
        }
        catch {

        }
      }, 25000 /** Math.floor(Math.random() * ([1,2,3][Math.floor(Math.random() * 4)]))*/);
    })
    this.CommandManager = new CommandManager(new CommandList(__dirname + "/commands"), this)
    this.ManagerBot = new ManagerBot(this.ManagerToken, this.Workers, this.ownerId, this.activeHours)
    this.ManagerBot.client.on("message", async (message) => {
      await this.CommandManager.Handle(this.ManagerBot.client, message)
    })
    this.ManagerBot.Run()
    this.tokens = undefined
  }
  async StartWorkership() {
    this.Workers.forEach(async (Worker) => {
      Worker.Run()
    })
  }
}

module.exports = ClientManager