require('dotenv').config({ path: '../.env' })
const express = require('express');
const app = express();
const { db, Models } = require('../db/db.js');
const { initialData } = require('./DefaultData.js');
const { default: mongoose } = require('mongoose');

const getFamilyTransactions = async (_id, month, year) => {
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

  const payload = {
    isPartOfAFamily: !!family,
    familyMembers: family ? Object.fromEntries(family.users.map(user => [user.id, user.nickname])) : [],
    incomeFromFamily: {},
    expensesFromFamily: {}
  };

  if (family) {
    const transactions = await Promise.all(
      family.users.map(async user => {
        if (user._id.equals(_id)) {
          return null; // Skip the current user
        }
        const result = await queryTransactions(user._id, month, year);
        return [user.id, result]; // Return a key-value pair
      })
    );

    // Filter out null entries and set the payload
    const validTransactions = transactions.filter(entry => entry !== null);

    payload.incomeFromFamily = Object.fromEntries(
      validTransactions.map(([id, { income }]) => [id, income])
    );

    payload.expensesFromFamily = Object.fromEntries(
      validTransactions.map(([id, { expenses }]) => [id, expenses])
    );
  }

  return payload;
};

async function getPayloadWithFamilyData(_id, email, year, month, userCurrency, defaultBudget = 3000, nickname, includesStart = false) {
  let payload
  if (includesStart === true) {
    payload = {
      main_currency: userCurrency || "EUR", // Use user currency if available, else default to EUR
      currency_table: initialData.currencyTable,
      email: email,
      picture: null, // Future version
      expenses: {},
      income: [],
      budget: defaultBudget,
      empty: true,
      nickname
    };
  } else {
    payload = {
      expenses: {},
      income: [],
      budget: defaultBudget,
    }
  }

  const newestExchangeRate = await Models.ExchangeRate.findOne().sort({ date: -1 }).exec();

  if (newestExchangeRate) {
    Object.assign(payload, { currency_table: newestExchangeRate.currency_table })
  }

  // Always retrieve family data
  const familyData = await getFamilyTransactions(_id, month, year);
  Object.assign(payload, familyData);

  // Fetch transaction data
  const transaction = await Models.Transaction.findOne({ user_id: _id, year, month });

  // If a transaction exists, update the payload with transaction data
  if (transaction) {
    Object.assign(payload, {
      expenses: transaction.expenses,
      income: transaction.income,
      budget: transaction.budget,
      empty: false,
    });
  }

  return payload;
}


app.get('/v1/start-data/:year/:month', async (req, res, next) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id, email } = verified;
    const { year, month } = req.params;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const user = await Models.User.findById(_id);

    // Should be impossible since it reaches this point only with a valid token
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const payload = await getPayloadWithFamilyData(_id, email, year, month, user.currency, null, user.nickname, true);
    return res.status(200).json(payload);
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

    const payload = await getPayloadWithFamilyData(_id, email, year, month, "EUR", false); // Default to EUR for transactions endpoint
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
