require('dotenv').config({ path: '../.env' })
const express = require('express');
const app = express();
const { db, Models } = require('../db/db.js');

app.use(express.json());

app.put('/v1/transactions', async (req, res, next) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id } = verified;
    const { year, month, expenses, income, budget } = req.body;

    if (!year || !month || !budget) {
      return res.status(400).json({ error: 'Year, month, and budget are required' });
    }

    let transaction = await Models.Transaction.findOne({ user_id: _id, year, month });

    if (transaction) {
      if (expenses) {
        transaction.expenses = expenses;
      }
      if (income) {
        transaction.income = income;
      }
      transaction.budget = budget;
    } else {
    let transaction = await Models.Transaction.findOne({ user_id: _id, year, month });
    transaction = new Models.Transaction({
        user_id: _id,
        year,
        month,
        expenses: expenses || {},
        income: income || [],
        budget
      });
    }

    await transaction.save();

    res.status(200).json("Successfully updated");

  } catch (error) {
    console.log('Error during updating transaction data', error);
    return res.status(500).json({ error: 'Error during updating transaction data' });
  }
});


const PORT = process.env.WRITE_MS_PORT || 8023;
app.listen(PORT, () => {
  console.log(`Write-service running on port ${PORT}`);
});
