//NOTE: token using this bot MUST BE PHONE VERIFIED.
const Discord = require('discord.js')
const BankBot = require('./BankBot')
process.env.TOKEN = '' //simulate repl.it
const BB = new BankBot(process.env.TOKEN, '852677579827314708')
BB.Run()