
const logReqInfo = (ctx,next) => {
  console.log("================================")
  console.log({
    message:ctx.message,
    userInfo:ctx.from,
    type:ctx.updateType,
    updateSubTypes:ctx.updateSubTypes
  })
  console.log("================================")
  next()
}




module.exports = {
  
  runBot:(bot)=>{
    
    bot.use(logReqInfo);
    bot.on('text',(ctx)=>ctx.reply(ctx.message.from.username));
    
    bot.start((ctx) => ctx.reply('Welcome'))
    bot.help((ctx) => ctx.reply('i still not sure what i do . . . '))
    bot.on('sticker', (ctx) => ctx.reply('👍'))

  }

}
