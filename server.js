const Telegraf = require('telegraf')
const express = require('express')
const expressApp = express()

const port = process.env.PORT || 5000 // Correct port will be returned here
const bot = new Telegraf(process.env.BOT_TOKEN)
console.log({port,token:process.env.BOT_TOKEN})

bot.on('text', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'))



expressApp.use(bot.webhookCallback('/itamir'))
bot.telegram.setWebhook('https://alphonsobot.herokuapp.com/itamir')

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
