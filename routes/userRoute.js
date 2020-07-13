const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session');
require('../config/passport.js')(passport)

// DB config
const db = require('../config/keys').userURI
const User = require('../models/userModel')

app.set("view-engine", 'ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.connect(db, {useNewUrlParser: true})

app.get("/Login", (req,res) =>{
  res.render("login.ejs")
})
// app.get("/Admin", (req,res) =>{
//   res.render("adminLogin.ejs")
// })
app.get('/Register', (req,res)=>{
  res.render("register.ejs")
})

// Login Handle
app.post('/Login', (req,res, next)=>{
  passport.authenticate('local',{
    successRedirect: '/', //On success redirect to home
    failureRedirect: '/Users/Login' //On failure redirect back to login page
  })(req,res,next);
})
module.exports = app

app.post('/register', (req,res)=>{
  const { first_name, last_name, username, email, password, password2 } = req.body;
  const newUser = new User({
    // name,
    first_name,
    last_name,
    username,
    email,
    password
  });
  //Hashing password for security
  bcrypt.genSalt(10, (err,salt)=>
  bcrypt.hash(newUser.password, salt, (err,hash)=>{
    if (err) throw err;
    // Setting the password to the hashed password
    newUser.password = hash
    // Save user to mongodb under userAccounts -> users
    newUser.save()
    .then(user =>{
    res.redirect('/Users/Login')
    })
    .catch(err => console.log(err))
    }))
});
