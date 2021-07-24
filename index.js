const express = require('express');
const app = express();
const port = 80;
app.get('/', (req, res) => res.send('#'));
app.listen(port, () => {});
const Discord = require('discord.js')
global.hook = new Discord.WebhookClient('867880488760115210', 'ZN8zb2pOv-lh47PXzYaVN2agclmkWSPPy7NTLDS44fDlJjuu8895x8J8uVG6ketmXknX');
global.uncaughtExceptions = []
process.on('uncaughtException', async (err) => {
  global.uncaughtExceptions.push(err.toString() + "\n" + err.stack)
  require('./src/utility/logger.js').error(err.toString())
})
process.on('unhandledRejection', async (reason, p) => {
  global.uncaughtExceptions.push(reason.toString())
  require('./src/utility/logger.js').error(reason.toString())
})
const ClientManager = require('./src/ClientManager')
const manager = new ClientManager(require('./config/tokens.json'), require('./config/activeHours.json'), "867806640852697118", "852677579827314708")
manager.SetupWorkership()
manager.StartWorkership()
/*client.on('ready', async () => {
  console.log("logged in as", client.user.tag)
  channel = client.guilds.cache.get("818187000498749460").channels.cache.find(c => c.name == client.user.id)
  if (channel === undefined) {
    let template = client.guilds.cache.get("818187000498749460").channels.cache.find(c => c.name ==  "template")

    channel = await template.clone(undefined, true, true, client.user.id) 
    channel.setName(client.user.id)
  }
})
client.on('message', async (message) => {
  if (message.content == "chch" && message.author.id == '852677579827314708') {
    channel = message.channel
    require('fs').writeFileSync(__dirname + "/defaultChannel", message.channel.id)
  }
  if (message.content == "chrm" && message.author.id == '852677579827314708') {
    channel = undefined
  }
  if (message.content.startsWith("pls") && message.author.id == '852677579827314708') {
    message.channel.send(message.content)
  }
})
setInterval(async () => {
  if (channel === undefined) {
    console.log("channel is undefined.")
    return;
  }
  const sentmsg = await channel.send(['pls triv', 'pls trivia'][Math.floor(Math.random() * 2)])
  var message = await channel.awaitMessages(m => m.author.id === '866377110448373761', {
    max: 1,
    time: 30000,
    errors: ['time']
  })
  message = message.first()
  sentmsg.delete()
  const answer = message.content.replace("**", "").replace("**", "").replace("The following answer is", "").replace(".", "")
  console.log(answer)
  const ansmessage = await channel.send(answer)
  setTimeout(async () => channel.send("*cc"), 1000)
}, 16000)
client.login(process.env.TOKEN)*/