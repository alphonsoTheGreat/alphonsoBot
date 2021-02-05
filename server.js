const Telegraf = require('telegraf')
const express = require('express')
const expressApp = express()

const port = process.env.PORT || 5000 // Correct port will be returned here
const bot = new Telegraf(process.env.BOT_TOKEN)

expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://MY-APP.heroku.com/secret-path')

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
