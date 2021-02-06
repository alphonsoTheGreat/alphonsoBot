const {Telegraf}  = require('telegraf')
const express = require('express')
const expressApp = express()

const port = process.env.PORT || 5000 // Correct port will be returned here
console.log({port,token:process.env.BOT_TOKEN})
const bot = new Telegraf(process.env.BOT_TOKEN)




bot.telegram.setWebhook('https://alphonsobot.herokuapp.com/bot-hook')


expressApp.use( (req, res,next) => {
  console.log("---------------------body ------")
  console.log(req.body)
  console.log("---------------------query ------")
  console.log(req.query)
  console.log("---------------------params ------")
  console.log(req.params)
  console.log("---------------------headers ------")
  console.log(req.headers)
  next()
})
expressApp.use(bot.webhookCallback('/bot-hook'))

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('i still not sure what i do . . . '))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))



expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.post('/bot-hook', (req, res,next) => {
  console.log("****--------------------body ------")
  console.log(req.body)
  console.log("---------------------query ------")
  console.log(req.query)
  console.log("---------------------params ------")
  console.log(req.params)
  console.log("---------------------headers ------")
  console.log(req.headers)
  next()
})

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
