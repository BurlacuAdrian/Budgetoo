const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  expenses: {
    type: Map,
    of: Array,
    default: {}
  },
  income: {
    type: Array,
    default: []
  },
  budget: {
    type: Number,
    required: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
