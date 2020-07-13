const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const adminPassport = require('passport')
const session = require('express-session');
require('../config/adminPassport.js')(adminPassport)

// DB config
const db = require('../config/keys').adminURI

app.set("view-engine", 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(adminPassport.initialize());
app.use(adminPassport.session());

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.connect(db, {useNewUrlParser: true})

app.get("/AdminPage", (req,res) =>{
  res.render("adminLogin.ejs")
})
app.get("/SignIn", (req,res) =>{
  res.render("adminLogin.ejs")
})
// Login Handle
app.post('/SignIn', (req,res, next)=>{
  adminPassport.authenticate('local',{
    successRedirect: '/AdminPage', //On success redirect to home
    failureRedirect: '/Admin/SignIn' //On failure redirect back to login page
  })(req,res,next);
})
module.exports = app
