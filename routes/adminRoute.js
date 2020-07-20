const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('express-flash')
const authUser = require('passport')
require('../config/passport.js')(authUser)
const {checkAdminAuthenticated, checkAuthenticated, checkNotAuthenticated} = require('../config/auth')


// DB config
const db = require('../config/keys').userURI

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
// mongoose.connect(db, {useNewUrlParser: true})

app.get("/SignIn", checkNotAuthenticated,(req,res) =>{
  res.render("adminLogin.ejs")
})
app.get("/Orders", checkAdminAuthenticated,  (req,res) =>{
  res.render("orders.ejs")
})
// Login Handle
app.post('/SignIn', checkNotAuthenticated, (req,res, next)=>{
  authUser.authenticate('local',{
    successRedirect: '/AdminPage', //On success redirect to home
    failureRedirect: '/Admin/SignIn', //On failure redirect back to login page
    failureFlash: true
  })(req,res,next);
})
module.exports = app
