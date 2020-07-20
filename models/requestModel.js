const mongoose = require('mongoose')
const RequestSchema = new mongoose.Schema({
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
  ready_by_date:{
    type:String,
    required: true

  },
  message:{
    type:String,
    required: true
  },
})

const Request = mongoose.model('Order', RequestSchema)
module.exports = Request;
