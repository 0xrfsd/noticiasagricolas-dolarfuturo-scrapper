const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getDolarFuturo = async () => {
  try {
    const siteUrl =
      "https://www.noticiasagricolas.com.br/cotacoes/mercado-financeiro/dolar-b3";

    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });

    const $ = cheerio.load(data);
    const elemSelector =
      "#content > div.middle > div.tables > div:nth-child(1) > div.table-content > table > tbody > tr";

    const keys = ["Contrato (Mês/Ano)", "Fechamento (R$/US$)", "Variação (%)"];

    const array = [];

    $(elemSelector).each((parentIdx, parentElem) => {
      let keyIdx = 0;
      const obj = {};

      $(parentElem)
        .children()
        .each((childIdx, childElem) => {
          let tdValue = $(childElem).text();

          if (tdValue) {
            obj[keys[keyIdx]] = tdValue;

            keyIdx++;
          }
        });

      array.push(obj);
    });
    return(array);
  } catch (e) {
    console.error(e);
  }
};

app.get('/getDolarFuturo', async (req, res) => {
    try {
        const data = await getDolarFuturo();
        res.status(200).send(data);
    } catch(e) {
        console.error(e);
    }
});

const porta = 3000;
app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));