const { Telegraf } = require('telegraf');
const { consts } = require('./utils');
const YahooClient = require('./utils/yahoo')
const xRapidapiHost = process.env.RAPID_HOST;
const xRapidapiKey = process.env.RAPID_KEY;

const yahooClient = new YahooClient(xRapidapiKey, xRapidapiHost)

const reg = RegExp(/analyze: [A-Za-z]/g);

module.exports = {

  runBot: (bot) => {

    bot.use(Telegraf.log())

    // bot.command('stock', async (ctx) => {
    //   return await ctx.reply('pick action', Markup
    //     .keyboard([
    //       ['get data', 'fetch symbol (GOOG)']
    //     ])
    //     .oneTime()
    //     .resize()
    //   )
    // })

    bot.command('getData', ctx => {

      const data = yahooClient.getStocksData();
      return ctx.reply(data)
    })

    // bot.hears("fetch symbol (GOOG)", ctx => {

    //   yahooClient.getSymbolData("GOOG", function (data) {
    //     // logger.INFO(PLACEHOLDER, data)
    //     return ctx.reply(yahooClient.pretty(data))
    //   });



    // return ctx.reply(JSON.stringify(data))

    // })



    // bot.hears("\(analyze: [A-Z]+)\w+", ctx => {
    // bot.hears(/\analyze: [A-Z]+\w+/, ctx => {

    bot.hears(reg, ctx => {

      const text = ctx.message.text

      const symbol = text.split(":")[1]
      if (typeof symbol !== "string" || symbol.length < 3)
        return ctx.reply(`something is wrong: ${symbol[1]}`)
      else
        yahooClient.getSymbolData(symbol, true, function (data) {
          // logger.INFO(PLACEHOLDER, data)
          return ctx.replyWithHTML(data)
        });
    })

    bot.hears("test", ctx => {
      return ctx.replyWithHTML(
        `
        <b>bold</b>, <strong>bold</strong>
        <i>italic</i>, <em>italic</em>
        <u>underline</u>, <ins>underline</ins>
        <s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
        <b>bold <i>italic bold <s>italic bold strikethrough</s> <u>underline italic bold</u></i> bold</b>
        <a href="http://www.example.com/">inline URL</a>
        <a href="tg://user?id=123456789">inline mention of a user</a>
        <code>inline fixed-width code</code>
        <pre>pre-formatted fixed-width code block</pre>
        <pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>
        `
      )
    })

    if (process.env.NODE_ENV === consts.env.development)
      bot.launch()


  }

}
