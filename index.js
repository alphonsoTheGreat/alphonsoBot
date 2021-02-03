const { Telegraf } = require('telegraf')
const secrets = require('./secret.json')

const bot = new Telegraf(secrets.token)
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
