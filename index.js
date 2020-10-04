const { Telegraf } = require("telegraf");
require("dotenv").config();

const rply = require("./templateReply.json");
const bot = new Telegraf(process.env.tokenBOT);

bot.start((ctx) => {
  ctx.reply(rply.greeting);
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.launch();
