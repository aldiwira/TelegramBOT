const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");
const Axios = require("axios").default;
const moment = require("moment");

moment.locale("id");
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

//Covid
const url = "https://indonesia-covid-19.mathdro.id/";
const covidRes = (location, data) => {
  return `Data Covid-19 di ${location} \n ${moment().format(
    "dddd, Do MMMM YYYY"
  )} \n Meninggal : ${data.meninggal} \n Sembuh : ${
    data.sembuh
  } \n Dalam Perawatan : ${data.perawatan} \n Jumlah seluruh kasus : ${
    data.jumlahKasus
  }`;
};
const covid = new Scene("covid");
covid.enter(({ reply }) => {
  return reply(
    "Selamat Data di Covid-19 Indonesia data. pilih data yang akan dilihat",
    Markup.keyboard([
      "Jumlah Semua Kasus",
      "Kasus per Provinsi",
      "Kasus Perhari",
      "back",
    ])
      .oneTime()
      .resize()
      .extra()
  );
});
covid.hears("Jumlah Semua Kasus", async (ctx) => {
  await Axios.get(url + "api").then(async (datas) => {
    const data = datas.data;
    await ctx.reply(covidRes("Indonesia", data));
  });
});
covid.hears("back", (ctx) => ctx.scene.enter("home"));

module.exports = { home, covid };
