const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");
const Axios = require("axios").default;
const moment = require("moment");

moment.locale("id");
const dateNow = moment().format("dddd, Do MMMM YYYY");
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
    Markup.keyboard(["Jumlah Semua Kasus", "Kasus per Provinsi", "home"])
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

covid.hears("Kasus per Provinsi", ({ reply }) => {
  return reply(
    "Ketikan nama provinsi",
    Markup.keyboard(["back"]).oneTime().resize().extra()
  );
});

covid.on("text", async (ctx) => {
  await Axios.get(url + "api/provinsi").then((datas) => {
    if (ctx.message.text === "back") {
      ctx.scene.enter("covid");
    } else if (ctx.message.text === "home") {
      ctx.scene.enter("home");
    }
    const data = datas.data.data;
    const userRegion = String(ctx.message.text).toLowerCase();
    data.map((value) => {
      const region = String(value.provinsi).toLowerCase();
      if (region === userRegion || region.includes(userRegion)) {
        console.log(value);
        const msg = `Data covid-19 di ${value.provinsi} \n ${dateNow} \n Kasus Positif : ${value.kasusPosi} \n Kasus Sembuh :  ${value.kasusSemb} \n Kasus Meninggal : ${value.kasusMeni}`;
        ctx.reply(msg);
      }
    });
  });
});

module.exports = { home, covid };
