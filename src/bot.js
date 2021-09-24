const { Telegraf } = require('telegraf');
const { consts } = require('./utils');
const { stocksProvider } = require('./DataProviders')


const yahooClientV2 = new stocksProvider.rapidStockProvider()

const reg = RegExp(/analyze: [A-Za-z]/g);

module.exports = {

  runBot: (bot) => {

    bot.use(Telegraf.log())

    bot.command('getData', ctx => {

      const data = yahooClient.getStocksData();
      return ctx.reply(data)
    })

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

    bot.hears("itay",async ctx => {
      const res = await yahooClientV2.fetchStockSummary("GOOG");
      console.log({res});
    })

    if (process.env.NODE_ENV === consts.env.development)
      bot.launch()


  }

}
