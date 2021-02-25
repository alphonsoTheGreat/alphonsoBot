# Telegram bot integrated with yahoo finance throw rapid api

using [express](https://expressjs.com) for the server running the bot with webhooks.

and [telegraf](https://telegraf.js.org) for telegram bot api.

deployed on [heroku](https://dashboard.heroku.com/apps).

---
the bot is integrated with yahoo finance api fetching stock data.


yahoo finance [docs from rapid api site](https://rapidapi.com/apidojo/api/Yahoo%20Finance).

and [google trends](https://www.npmjs.com/package/google-trends-api) for fetching stock trends *(future)*


------

Make sure you:
1. run npm install 
2. add the folowing environment variables:
    1. PORT
    2. BOT_TOKEN
    3. RAPID_HOST
    4. RAPID_KEY
    5. WEBHOOK_BASE_URL
    6. WEBHOOK_PATH

 if you run development add those variables to ```utils/dev.env``` file

for development run ```npm run devserver```

for production run ```npm run start```
