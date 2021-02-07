const textMiddleware = (ctx) => ctx.reply('this is a text middleware'))






module.exports = {
  
  runBot:(bot)=>{
    
    bot.on('text', textMiddleware)
    
    bot.start((ctx) => ctx.reply('Welcome'))
    bot.help((ctx) => ctx.reply('i still not sure what i do . . . '))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.hears('hi', (ctx) => ctx.reply('Hey there'))
  }

}
