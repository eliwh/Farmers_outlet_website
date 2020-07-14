const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('express-flash')
const adminPassport = require('passport')
require('../config/adminPassport.js')(adminPassport)

// DB config
const db = require('../config/keys').userURI

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.connect(db, {useNewUrlParser: true})

app.get("/SignIn", (req,res) =>{
  res.render("adminLogin.ejs")
})
// Login Handle
app.post('/SignIn', (req,res, next)=>{
  adminPassport.authenticate('local',{
    successRedirect: '/AdminPage', //On success redirect to home
    failureRedirect: '/Admin/SignIn', //On failure redirect back to login page
    failureFlash: true
  })(req,res,next);
})
module.exports = app
