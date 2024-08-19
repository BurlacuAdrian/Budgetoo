require('dotenv').config({ path: '../.env' })
const express = require('express');
const app = express();
const { db, Models } = require('../db/db.js');
const { initialData } = require('./DefaultData.js');
const { default: mongoose } = require('mongoose');

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

    //Should be impossible since it reaches this point only with a valid token
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    var payload = {
      main_currency: user.currency,
      currency_table: initialData.currencyTable,
      email,
      picture: null,
      //TODO update this
      empty: true,
      nickname: user.nickname
    }

    if (!transaction) {

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

    const family = await Models.Family.findOne({ users: { $in: [new mongoose.Types.ObjectId(_id)] } }).populate('users');

    const queryTransactions = async (queriedId, queriedMonth, queriedYear) => {
      const transaction = await Models.Transaction.findOne({
        user_id: queriedId, 
        month: queriedMonth,
        year: queriedYear
      });
      
      return {
        income: transaction?.income || [],
        expenses: transaction?.expenses || []
      };
    };


    if (family) {
      payload.isPartOfAFamily = true;
      payload.familyMembers = family.users.map(user => user.nickname || user.email)
      
      const transactions = await Promise.all(
        family.users.map(async user => {
          if (user._id.equals(_id)) {
            return null; // Skip the current user
          }
          const result = await queryTransactions(user._id, month, year);
          // console.log(result);
          return [user.nickname, result]; // Return a key-value pair
        })
      );
    
      // Filter out null entries and set the payload
      const validTransactions = transactions.filter(entry => entry !== null);
      
      payload.incomeFromFamily = Object.fromEntries(
        validTransactions.map(([nickname, { income }]) => [nickname, income])
      );
    
      payload.expensesFromFamily = Object.fromEntries(
        validTransactions.map(([nickname, { expenses }]) => [nickname, expenses])
      );
    } else {
      payload.isPartOfAFamily = false;
      payload.familyMembers = [];
      payload.incomeFromFamily = {};
      payload.expenseFromFamily = {};
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
    const { _id, email } = verified;
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
