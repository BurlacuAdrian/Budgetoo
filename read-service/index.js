require('dotenv').config({ path: '../.env' })
const express = require('express');
const app = express();
const { db, Models } = require('../db/db.js');
const { initialData } = require('./DefaultData.js');

app.get('/v1/start-data/:year/:month', async (req, res, next) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id, email } = verified;
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const transaction = await Models.Transaction.findOne({ user_id: _id, year, month });
    const user = await Models.User.findById(_id)

    var payload = {
      main_currency: user.currency,
      currency_table: initialData.currencyTable,
      email,
      picture: null,
      //TODO update this
      empty: true
    }

    if (!transaction) {
      // return res.status(404).json({ error: 'Transaction not found' });
      payload = {
        ...payload,
        expenses: {},
        income: [],
        budget: 3000,
      }
      return res.status(200).json(payload)
    }

    payload = {
      ...payload,
      expenses: transaction.expenses,
      income: transaction.income,
      budget: transaction.budget,
    }


    return res.status(200).json(payload)


  } catch (error) {
    console.log('Error during fetching start-data', error);
    return res.status(500).json({ error: 'Error during fetching start-data' });
  }
});

app.get('/v1/transactions/:year/:month', async (req, res, next) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id, email} = verified;
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const transaction = await Models.Transaction.findOne({ user_id: _id, year, month });

    var payload = {
      main_currency: "EUR",//Default
      currency_table: initialData.currencyTable,
      email: email,
      picture: null,//Future version
      expenses: {},
      income: [],
      budget: 3000,
      empty: true
    }

    if (transaction) {
      payload = {
        ...payload,
        expenses: transaction.expenses,
        income: transaction.income,
        budget: transaction.budget,
        empty: false
      };
    }

    return res.status(200).json(payload);

  } catch (error) {
    console.log('Error during fetching transaction data', error);
    return res.status(500).json({ error: 'Error during fetching transaction data' });
  }
});



const PORT = process.env.READ_MS_PORT || 8022;
app.listen(PORT, () => {
  console.log(`Read-service running on port ${PORT}`);
});
