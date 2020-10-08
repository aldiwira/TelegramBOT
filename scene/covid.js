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

covid.hears(listMenu[0], async (ctx) => {
  await Axios.get(url + "indonesia").then((datas) => {
    if (datas.status === 200) {
      const covidData = datas.data[0];
      const response = `Data Covid-19 di ${covidData.name} \nKasus positif : ${covidData.positif}\nKasus Sembuh : ${covidData.sembuh}\nKasus Meninggal : ${covidData.meninggal}\nMasih dirawat : ${covidData.dirawat} `;
      ctx.reply(response);
    }
  });
});

module.exports = covid;
