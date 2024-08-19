const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  budgets: {
    type: mongoose.Schema.Types.Map,
    required: true
  },
});

const Family = mongoose.model('Family', familySchema);

module.exports = Family;
