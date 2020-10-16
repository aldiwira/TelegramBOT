const express = require("express");
const { Telegraf } = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
require("dotenv").config();

const home = require("./scene/home");
const covid = require("./scene/covid");
const earthquake = require("./scene/earthquake");
const quran = require("./scene/alquran");

//webhook and bot initial
const appPress = express();
const TOKEN = process.env.tokenBOT;
const bot = new Telegraf(TOKEN);

//stage installation
const stage = new Stage([home, covid, earthquake, quran]);

bot.use(session());
process.env.NODE_ENV === "development" ? bot.use(Telegraf.log()) : null;
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply(`Selamat datang ${ctx.chat.first_name} di BOT Suka Suka`);
  console.log(`Session start by ${ctx.chat.first_name}`);
  await ctx.scene.enter("home");
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.startPolling();

appPress.get("/", (req, res) => {
  res.send("Just bot webhooks");
});

const PORT = process.env.PORT || 2309;
appPress.listen(PORT, () => {
  console.log(`Server Started, Listen at ${PORT}`);
});
