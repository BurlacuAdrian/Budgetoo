const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true,
    unique: false
  },
  g_id: {
    type: String,
    required: false,
    unique: false
  },
  currency: {
    type: String,
    required: false,
    unique: false,
    default: 'EUR'
  }
});

// Create and export the model
const User = mongoose.model('User', userSchema);
module.exports = User;
