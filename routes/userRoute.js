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

const session = require('express-session');
const {checkAuthenticated, checkNotAuthenticated} = require('../config/auth')


// DB config
const userDB = require('../config/keys').MongoURI
const User = require('../models/userModel')

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(flash())

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(userDB)

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
  authUser.authenticate('authUser',{
    successRedirect: '/', //On success redirect to home
    failureRedirect: '/Users/Login', //On failure redirect back to login page
    session: true,
    failureFlash:true
  })(req,res,next);
})
module.exports = app

app.post('/register', checkNotAuthenticated, (req,res)=>{
  const { admin, first_name, last_name, username, email, password, password2 } = req.body;
  let errors = []
  if(password != password2){
    errors.push()
    req.flash('error_msg','Passwords Do Not Match');
  }
  if(errors.length > 0){
    res.render('Register',{
      admin,
      first_name,
      last_name,
      username,
      email,
      password,
      password2
    })
  }else{
    User.findOne({ username: username }).then(user => {
      if (user) {
        req.flash('error_msg','Username Taken');
        res.render('Register', {
          admin,
          first_name,
          last_name,
          username,
          email,
          password,
          password2
        });
      }
else{
  const newUser = new User({
    // name,
    admin: 'False',
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
      req.flash('success_msg','You are now registered and can log in');
      res.redirect('/Users/Login')
    })
    .catch(err => console.log(err))
    }))
  }
  });
  }
});
