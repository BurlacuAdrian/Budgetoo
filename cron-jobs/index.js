const cron = require('node-cron');
const axios = require('axios');
const { db, Models } = require('../db/db.js');
const xml2js = require('xml2js');

function parseXML(xmlString) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xmlString, (err, result) => {
      if (err) {
        reject(err);
      } else {
        const date = result.DataSet.Body[0].Cube[0].$.date;
        const rates = result.DataSet.Body[0].Cube[0].Rate;
        
        const currency_table = {
          RON: { EUR: 0, USD: 0 },
          EUR: { RON: 0, USD: 0 },
          USD: { RON: 0, EUR: 0 }
        };

        function truncate(num) {
          return parseFloat(num.toFixed(4));
        }

        rates.forEach(rate => {
          const currency = rate.$.currency;
          const value = parseFloat(rate._);
          
          if (currency === 'EUR') {
            currency_table.RON.EUR = truncate(1 / value);
            currency_table.EUR.RON = value;
          } else if (currency === 'USD') {
            currency_table.RON.USD = truncate(1 / value);
            currency_table.USD.RON = value;
          }
        });

        // Calculate EUR to USD and USD to EUR
        currency_table.EUR.USD = truncate(currency_table.EUR.RON / currency_table.USD.RON);
        currency_table.USD.EUR = truncate(1 / currency_table.EUR.USD);

        resolve({ date, currency_table });
      }
    });
  });
}


cron.schedule('10 13 * * *', async () => {
    try {
        const response = await axios.get('https://www.bnr.ro/nbrfxrates.xml');
        const data = response.data;

        const result = await parseXML(data)
        console.log(result)

        const exchangeRate = await Models.ExchangeRate.create(result)
        console.log('Data fetched and stored successfully');
    } catch (error) {
        console.error('Error during API call or data storage', error);
    }
})
