const { Telegraf } = require('telegraf')
const express = require('express')
const botService = require('./bot.js')
// const botService = require('./exampleBot.js')

if (process.env.NODE_ENV === "development")
  require('./utils/devinit.ignore')

const expressApp = express();

const port = process.env.PORT || 5000 // Correct port will be returned here

// init the bot
const bot = new Telegraf(process.env.BOT_TOKEN)

// tell telegram our webhook
bot.telegram.setWebhook('https://alphonsobot.herokuapp.com/bot-hook')

// set our webhook
expressApp.use(bot.webhookCallback('/bot-hook'))

botService.runBot(bot)


expressApp.listen(port, () => {
  console.log(`bot is listening on port ${port}!`)
})
