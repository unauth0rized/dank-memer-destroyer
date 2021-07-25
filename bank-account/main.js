//NOTE: token using this bot MUST BE PHONE VERIFIED.
const Discord = require('discord.js')
const BankBot = require('./BankBot')
process.env.TOKEN = 'ODY4OTUwODUzMjcxMjg5OTI3.YP3Icg.8vF87KEni3V2Si7g0HpPbQsI6Xc' //simulate repl.it
const BB = new BankBot(process.env.TOKEN, '852677579827314708')
BB.Run()