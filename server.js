const {Telegraf}  = require('telegraf')
const express = require('express')
const expressApp = express()

const port = process.env.PORT || 5000 // Correct port will be returned here
console.log({port,token:process.env.BOT_TOKEN})
const bot = new Telegraf(process.env.BOT_TOKEN)




bot.telegram.setWebhook('https://alphonsobot.herokuapp.com/itamir')

expressApp.use(bot.webhookCallback('/itamir'))

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))



expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
