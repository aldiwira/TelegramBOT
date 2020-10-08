const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");

//home
const home = new Scene("home");
home.enter(({ reply }) => {
  return reply(
    "Pilih layanan yang akan dibuka",
    Markup.keyboard(["Covid-19", "Weather (On Going)"])
      .oneTime()
      .resize()
      .extra()
  );
});
home.hears("Covid-19", async (ctx) => ctx.scene.enter("covid"));

module.exports = home;
