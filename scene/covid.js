const Scene = require("telegraf/scenes/base");
const Markup = require("telegraf/markup");
const Axios = require("axios").default;
const moment = require("moment");

moment.locale("id");
const dateNow = moment().format("dddd, Do MMMM YYYY");

//Covid
const url = "https://api.kawalcorona.com/";

const covid = new Scene("covid");

const listMenu = ["Jumlah Semua Kasus", "Kasus per Provinsi", "home"];

covid.enter(({ reply }) => {
  return reply(
    "Selamat Datang di Covid-19 Indonesia data. pilih data yang akan dilihat",
    Markup.keyboard(listMenu).oneTime().resize().extra()
  );
});
//all indonesian case
covid.hears(listMenu[0], async (ctx) => {
  await Axios.get(url + "indonesia").then((datas) => {
    if (datas.status === 200) {
      const covidData = datas.data[0];
      const response = `Data Covid-19 di ${covidData.name} \nKasus positif : ${covidData.positif}\nKasus Sembuh : ${covidData.sembuh}\nKasus Meninggal : ${covidData.meninggal}\nMasih dirawat : ${covidData.dirawat} `;
      ctx.reply(response);
    }
  });
});

//province covid data
covid.hears(listMenu[1], async ({ reply }) => {
  return reply(
    "Ketikan nama provinsi",
    Markup.keyboard(["back"]).oneTime().resize().extra()
  );
});
//for searcheing province covid datas
covid.on("text", async (ctx) => {
  if (ctx.message.text === "back") {
    ctx.scene.enter("covid");
  } else if (ctx.message.text === "home") {
    ctx.scene.enter("home");
  }
  await Axios.get(url + "indonesia/provinsi/").then((datas) => {
    if (datas.status === 200) {
      const provDatas = datas.data;
      provDatas.map((data) => {
        const attr = data.attributes;
        const inputProv = String(ctx.message.text).toLowerCase();
        const dataProv = String(attr.Provinsi).toLowerCase();
        if (dataProv.includes(inputProv)) {
          const msg = `Data kasus covid-19 di ${attr.Provinsi}\nKasus Positif : ${attr.Kasus_Posi}\nKasus yang sembuh : ${attr.Kasus_Semb}\nKasus yang meninggal : ${attr.Kasus_Meni} `;
          ctx.reply(msg);
        }
      });
    }
  });
});

module.exports = covid;
