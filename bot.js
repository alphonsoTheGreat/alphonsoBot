const { Telegraf, Markup } = require('telegraf')
const YahooClient = require('./utils/yahoo')

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
        return ctx.reply(JSON.stringify(data))
      });



      // return ctx.reply(JSON.stringify(data))

    })
  }

}
