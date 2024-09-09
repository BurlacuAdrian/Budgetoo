const mongoose = require('mongoose');

const CurrencyTableSchema = new mongoose.Schema({
  EUR: {
    RON: { type: Number },
    USD: { type: Number }
  },
  USD: {
    EUR: { type: Number },
    RON: { type: Number }
  },
  RON: {
    EUR: { type: Number },
    USD: { type: Number }
  }
}, { _id: false });

const ExchangeRateSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  currency_table: { type: CurrencyTableSchema, required: true }
});

const ExchangeRate = mongoose.model('ExchangeRate', ExchangeRateSchema);

module.exports = ExchangeRate;