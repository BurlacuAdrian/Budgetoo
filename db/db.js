const mongoose = require('mongoose');
const User = require('./Models/User.js');
const Transaction = require("./Models/Transaction.js")
const Family = require("./Models/Family.js")
const Models = {User, Transaction, Family}

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/budgetoo';
const options = {
  maxPoolSize: 10, // Adjust the pool size based on your needs
};

mongoose.connect(uri, options);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to ' + uri);
});

db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

module.exports = {db, Models};
