const mongoose = require('mongoose')
const ContactSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true
  },
  item:{
    type:String,
    required: true
  },
  message:{
    type:String,
    required: true
  },
})

const Contact = mongoose.model('inquiry', RequestSchema)
module.exports = Contact;
