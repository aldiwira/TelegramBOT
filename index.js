const { Telegraf } = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");
require("dotenv").config();

const bot = new Telegraf(process.env.tokenBOT);
const { home, covid } = require("./scene");

//stage installation
const stage = new Stage([home, covid]);

bot.use(session());
(process.env.NODE_ENV === 'development'?bot.use(Telegraf.log()):null)
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply(`Selamat datang ${ctx.chat.first_name} di BOT Suka Suka`);
  console.log(`Session start by ${ctx.chat.first_name}`)
  await ctx.scene.enter("home");
});

bot.launch();
