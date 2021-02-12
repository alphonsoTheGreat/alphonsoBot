// const { Telegraf } = require('telegraf')
// const secrets = require('./secret.json')

// const bot = new Telegraf(secrets.token);

// var PORT = process.env.PORT || 8443;

// const logger = (message)=>{
//   console.log("INFO :: EVENT :: "+message)
// }
// logger("port: "+PORT)


// // bot.hears('hi', (ctx) => ctx.reply('Hey there'))
// bot.hears('a', (ctx) => ctx.reply('hear'))
// bot.hears('ido', (ctx) => ctx.reply('is too beautifull'))
// // bot.hears('b', (ctx) => ctx.reply('b hear'))
// bot.command('b', (ctx) => ctx.reply('command'))

// bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.start((ctx) => ctx.reply('Welcome'))
// bot.help((ctx) => ctx.reply('Send me a sticker'))


// bot.telegram.setWebhook('https://-----.localtunnel.me/secret-path')

// // Start https webhook
// bot.startWebhook('/secret-path', null, PORT)

// // bot.command("b")
// bot.launch()



// process.once('SIGINT', () => {
//     logger("SIGINT")
//     bot.stop('SIGINT')})
// process.once('SIGTERM', () => {
//     logger("SIGTERM")
//     bot.stop('SIGTERM')
// })






const YahooClient = require('./utils/yahoo')


const xRapidapiHost = "apidojo-yahoo-finance-v1.p.rapidapi.com";
const xRapidapiKey = "6c15d749bbmsh90b56ad172bf4b6p1d3d99jsnfd144084ef7d";

const yahooClient = new YahooClient(xRapidapiKey, xRapidapiHost)
