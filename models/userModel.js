const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  admin:{
    type: String
  },
  username:{
    type: String,
    required: true
  },
  first_name:{
    type: String,
    required: true
  },
  last_name:{
    type: String,
    required: true
  },
  email:{
    type: String
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema, 'users')
module.exports = User;
