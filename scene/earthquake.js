const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");
const Extra = require("telegraf/extra");
const Axios = require("axios").default;
const moment = require("moment");
const { xml2js } = require("xml-js");

moment.locale("id");
const dateNow = moment().format("dddd, Do MMMM YYYY");
const url = "https://data.bmkg.go.id/";
const eqScene = new Scene("earthquake");

const xmlParser = (data) => {
  return xml2js(data, { compact: true });
};

const homeList = ["Gempa hari ini", "Home"];

eqScene.enter(({ reply }) => {
  return reply(
    "Selamat datang di informasi gempa di indonesia\n data diambil dari BMKG",
    Markup.keyboard(homeList).resize().extra()
  );
});

eqScene.hears(homeList[0], async (ctx) => {
  await Axios.get(url + "autogempa.xml").then(async (datas) => {
    const infoGempa = xmlParser(datas.data).Infogempa.gempa;
    const location = {
      Lintang: String(infoGempa.point.coordinates._text).split(",")[0],
      Bujur: String(infoGempa.point.coordinates._text).split(",")[1],
    };
    await ctx.reply("Informasi gempa hari ini");
    await ctx.replyWithLocation(location.Bujur, location.Lintang);
    await ctx.replyWithAnimation({ url: "https://data.bmkg.go.id/eqmap.gif" });
    const resText = `Waktu Kejadian \nTanggal : ${infoGempa.Tanggal._text}\nJam : ${infoGempa.Jam._text}\n\nKoordinat\nLintang : ${location.Lintang}\nBujur : ${location.Bujur}\n\nData Gempa \nKekuatan Gempa : ${infoGempa.Magnitude._text}\nKedalaman Gempa : ${infoGempa.Kedalaman._text}\n${infoGempa.Potensi._text}\n\nRincian Lokasi : \n${infoGempa.Wilayah1._text}\n${infoGempa.Wilayah2._text}\n${infoGempa.Wilayah3._text}\n${infoGempa.Wilayah4._text}\n${infoGempa.Wilayah5._text}`;
    await ctx.reply(resText);
    await backHandler(ctx);
  });
});

eqScene.on("text", async (ctx) => {
  const text = ctx.message.text;
  if (text === "Home") {
    ctx.scene.enter("home");
  }
});

module.exports = eqScene;
