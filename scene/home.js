const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");

//home
const home = new Scene("home");
const list = ["Covid-19", "Info Gempa bumi"];
home.enter(({ reply }) => {
  return reply(
    "Pilih layanan yang akan dibuka",
    Markup.keyboard(list).oneTime().resize().extra()
  );
});
home.hears(list[0], async (ctx) => await ctx.scene.enter("covid"));
home.hears(list[1], async (ctx) => await ctx.scene.enter("earthquake"));

module.exports = home;
