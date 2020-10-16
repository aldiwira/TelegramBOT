const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");
const Axios = require("axios").default;
const moment = require("moment");

moment.locale("id");
const dateNow = moment().format("dddd, Do MMMM YYYY");

//quran time

const url = "https://al-quran-8d642.firebaseio.com/data.json?print=pretty";

const quran = new Scene("quran");

const listMenu = ["Cari Surah", "Home"];

quran.enter(async ({ reply }) => {
  return reply(
    "Al Quran dan Terjemaah",
    Markup.keyboard(listMenu).oneTime().resize().extra()
  );
});

quran.hears(listMenu[0], async (ctx) => {
  ctx.session.typeSearch = "surah";
  return ctx.reply(
    "Masukkan nama surah",
    Markup.keyboard(["Back"]).oneTime().resize().extra()
  );
});

quran.on("text", async (ctx) => {
  if (ctx.message.text === "back") {
    ctx.session.typeSearch = null;
    await ctx.scene.enter("quran");
  } else if (ctx.message.text === "home") {
    await ctx.scene.enter("home");
  }
  if (ctx.session.typeSearch === "surah") {
    await Axios.get(url).then((datas) => {
      if (datas.status === 200) {
        const quranDatas = datas.data;
        quranDatas.map(async (value) => {
          const inputSurah = String(ctx.message.text).toLowerCase();
          const dataSurah = String(value.nama).toLowerCase();
          if (dataSurah.includes(inputSurah)) {
            const msg = `${value.nama} (${value.asma}) \nArti dalam bahasa : ${value.arti}`;
            await ctx.reply(msg);
            await ctx.replyWithAudio(value.audio);
          }
        });
      }
    });
  }
});

module.exports = quran;
