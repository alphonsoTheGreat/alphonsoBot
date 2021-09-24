const { Telegraf } = require('telegraf')
const express = require('express')
const botService = require('./bot.js')



const server = express();

const port = process.env.PORT || 5000 // Correct port will be returned here

const webhookUrl = process.env.WEBHOOK_BASE_URL + process.env.WEBHOOK_PATH

// init the bot
const bot = new Telegraf(process.env.BOT_TOKEN)

// tell telegram our webhook
bot.telegram.setWebhook(webhookUrl)

// set our webhook
server.use(bot.webhookCallback(process.env.WEBHOOK_PATH))

botService.runBot(bot)


server.listen(port, () => {
  console.log(`bot is listening on port ${port}!`)
})





