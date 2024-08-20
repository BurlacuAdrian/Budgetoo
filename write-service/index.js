require('dotenv').config({ path: '../.env' })
const express = require('express');
const app = express();
const { db, Models } = require('../db/db.js');

app.use(express.json());

app.put('/v1/transactions', async (req, res, next) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id } = verified;
    const { year, month, expenses, income, budget, main_currency} = req.body;

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
      if (budget) {
        transaction.budget = budget;
      }
    } else {
    transaction = new Models.Transaction({
        user_id: _id,
        year,
        month,
        expenses: expenses || {},
        income: income || [],
        budget: budget || 3000,
      });
    }

    const user = await Models.User.findById(_id)
    user.currency = main_currency

    await user.save()
    await transaction.save();

    res.status(200).json("Successfully updated");

  } catch (error) {
    console.log('Error during updating transaction data', error);
    return res.status(500).json({ error: 'Error during updating transaction data' });
  }
});

app.put('/v1/nickname/:nickname', async (req, res, next) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id } = verified;
    const { nickname } = req.params;

    if (!nickname) {
      return res.status(400).json({ error: 'Nickname required!' });
    }

    const user = await Models.User.findById(_id)

    if(!user){
      return res.status(404).json({ error: 'User not found!' });
    }

    user.nickname = nickname
    await user.save();

    res.status(200).json("Successfully updated");

  } catch (error) {
    console.log('Error during updating nickname', error);
    return res.status(500).json({ error: 'Error during updating nickname' });
  }
});

app.put('/v1/expense', async (req, res) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id } = verified;
    const { year, month, category, name, amount, currency } = req.body;

    
    if (!year || !month || !category || !name || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    
    let transaction = await Models.Transaction.findOne({ user_id: _id, year, month });

    if (transaction) {
      
      if (!transaction.expenses[category]) {
        
        transaction.expenses[category] = [];
      }

      
      transaction.expenses[category].push([name, amount, currency]);

      
      await transaction.save();
    } else {
      
      const newTransaction = new Models.Transaction({
        user_id: _id,
        year,
        month,
        expenses: {
          [category]: [[name, amount, currency]],
        },
        income: [],
        budget: 3000 
      });

      await newTransaction.save();
    }

    return res.status(200).json({ message: 'Expense added/updated successfully' });
  } catch (error) {
    console.error('Error adding/updating expense:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/v1/income', async (req, res) => {
  try {
    const verified = JSON.parse(req.header('Verified'));
    const { _id } = verified;
    const { year, month, name, amount, currency } = req.body;

    
    if (!year || !month || !name || !amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    
    let transaction = await Models.Transaction.findOne({ user_id: _id, year, month });

    if (transaction) {
      
      transaction.income.push([name, amount, currency]);

      
      await transaction.save();
    } else {
      
      const newTransaction = new Models.Transaction({
        user_id: _id,
        year,
        month,
        expenses: {},
        income: [[name, amount, currency]],
        budget: 3000 
      });

      
      await newTransaction.save();
    }

    return res.status(200).json({ message: 'Income added/updated successfully' });
  } catch (error) {
    console.error('Error adding/updating income:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



const PORT = process.env.WRITE_MS_PORT || 8023;
app.listen(PORT, () => {
  console.log(`Write-service running on port ${PORT}`);
});
