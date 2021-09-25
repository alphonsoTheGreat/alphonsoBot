const express = require('express')

const { botService } = require('./utils')

const bot = botService.initBot();

const port = process.env.PORT || 5000;

const server = express();

// set our webhook
server.use(bot.webhookCallback(process.env.WEBHOOK_PATH))

server.listen(port, () => {
  console.log(`bot is listening on port ${port}!`)
})





