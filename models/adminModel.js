const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
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

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = Admin;
