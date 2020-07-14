const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const methodOverride = require('method-override')
const flash = require('express-flash')
// You can find this declaration here as well as in the admin route as well. The
// reason that we are storing passport into the variable authUser is due to the
// inconveniences that will occur if we do not. If we don't do this, then we will
// not be able to have both admin and user login working simoltaneously, we will only
// have one working, but not the other
const passport = require('passport')
const authUser = new passport.Passport();
require('../config/passport.js')(authUser)
// const {checkAuthenticated} = require('../config/auth')
// const {checkNotAuthenticated} = require('../config/auth')

const session = require('express-session');
const {checkAuthenticated, checkNotAuthenticated} = require('../config/auth')


// DB config
const db = require('../config/keys').userURI
const User = require('../models/userModel')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.connect(db, {useNewUrlParser: true})

app.get("/Login", checkNotAuthenticated,(req,res) =>{
  res.render("login.ejs")
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/Users/Login')
})

app.get('/Register', checkNotAuthenticated,  (req,res)=>{
  res.render("register.ejs")
})

// Login Handle
app.post('/Login', checkNotAuthenticated,(req,res, next)=>{
  authUser.authenticate('local',{
    successRedirect: '/', //On success redirect to home
    failureRedirect: '/Users/Login', //On failure redirect back to login page
    session: true,
    failureFlash:true
  })(req,res,next);
})
module.exports = app

app.post('/register', checkNotAuthenticated, (req,res)=>{
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
    res.flash('success_msg', 'You are now registered')
    })
    .catch(err => console.log(err))
    }))
});
