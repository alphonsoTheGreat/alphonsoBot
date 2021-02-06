module.exports = {
  
  runBot:(bot)=>{
      
    bot.start((ctx) => ctx.reply('Welcome'))
    bot.help((ctx) => ctx.reply('i still not sure what i do . . . '))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.hears('hi', (ctx) => ctx.reply('Hey there'))
  }

}
