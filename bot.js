const {Telegraf} = require('telegraf');

const API_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL ='https://alphonsobot.herokuapp.com'

const bot = new Telegraf(API_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);

bot.on('text', ({ replyWithHTML }) => replyWithHTML('<b>Hello</b>'))


