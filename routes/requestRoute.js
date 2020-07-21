const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session');


// DB config
const db = require('../config/keys').MongoURI
const Request = require('../models/requestModel')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({
  extended: false
}))
app.use(flash())

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(db)
// Route works but for some reason is looking in the userAccounts database for information
// instead of the Request databse
// app.get('/Orders', checkNotAuthenticated, (req, res) => {
//   Request.find({}).then(results => {
//     res.render('orders.ejs', {
//       Orders: results
//     });
//   })
// })
// TODO:  Implement request
app.get('/Place_An_Order', (req, res) => {
  res.render('request.ejs')
})
app.post('/Orders', (req, res) => {
  const {
    name,
    email,
    item,
    ready_by_date,
    message
  } = req.body;
  const newRequest = new Request({
    name,
    email,
    item,
    ready_by_date,
    message
  });

  newRequest.save().then(newRequest => {
    res.redirect('/')
  })
})

module.exports = app
