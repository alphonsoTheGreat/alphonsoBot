const { Telegraf, Markup } = require('telegraf');
const logger = require('./utils/logger');
const YahooClient = require('./utils/yahoo')
const PLACEHOLDER = "bot.js"
const xRapidapiHost = "apidojo-yahoo-finance-v1.p.rapidapi.com";
const xRapidapiKey = "6c15d749bbmsh90b56ad172bf4b6p1d3d99jsnfd144084ef7d";

const yahooClient = new YahooClient(xRapidapiKey, xRapidapiHost)


module.exports = {

  runBot: (bot) => {

    bot.use(Telegraf.log())

    bot.command('stock', async (ctx) => {
      return await ctx.reply('pick action', Markup
        .keyboard([
          ['get data', 'fetch symbol (GOOG)']
        ])
        .oneTime()
        .resize()
      )
    })



    bot.hears('get data', ctx => {

      const data = yahooClient.getStocksData();

      return ctx.reply(JSON.stringify(data))
    })
    bot.hears("fetch symbol (GOOG)", ctx => {

      yahooClient.getSymbolData("GOOG", function (data) {
        // logger.INFO(PLACEHOLDER, data)
        return ctx.reply(yahooClient.pretty(data))
      });



      // return ctx.reply(JSON.stringify(data))

    })



    // bot.hears("\(analyze: [A-Z]+)\w+", ctx => {
    bot.hears(/\(analyze: [A-Z]+)\w+/, ctx => {

      // logger.INFO(PLACEHOLDER, ctx.)
      return ctx.reply("ok")

    })



  }

}
