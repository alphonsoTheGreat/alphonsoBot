const textMiddleware = (ctx,next) => {
  console.log({ctx})
  console.log({obj:Object.keys(ctx)})
  next()
}

const responseWithTextMiddleware =(text)=> (ctx) => {
  ctx.replay(text)
}






module.exports = {
  
  runBot:(bot)=>{
    
    bot.on('text', textMiddleware,responseWithTextMiddleware("thank you for you kind words!"))
    
    bot.start((ctx) => ctx.reply('Welcome'))
    bot.help((ctx) => ctx.reply('i still not sure what i do . . . '))
    bot.on('sticker', (ctx) => ctx.reply('👍'))

  }

}
