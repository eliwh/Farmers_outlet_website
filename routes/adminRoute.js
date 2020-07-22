// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')
// const ejs = require('ejs')
// const bodyParser = require('body-parser')
// const session = require('express-session');
// const flash = require('express-flash')
// const authUser = require('passport')
// require('../config/passport.js')(authUser)
// const {checkAdminAuthenticated, checkAuthenticated, checkNotAuthenticated} = require('../config/auth')
//
//
// // DB config
// const db = require('../config/keys').userURI
//
// app.set('view-engine', 'ejs')
// app.use(express.urlencoded({ extended: false }))
// app.use(flash())
//
// //connect to mongodb
// mongoose.set('useUnifiedTopology', true)
// // mongoose.connect(db, {useNewUrlParser: true})
//
// app.get("/SignIn", checkNotAuthenticated,(req,res) =>{
//   res.render("adminLogin.ejs")
// })
// app.get("/Orders", checkAdminAuthenticated,  (req,res) =>{
//   res.render("orders.ejs")
// })
// // Login Handle
// app.post('/SignIn', checkNotAuthenticated, (req,res, next)=>{
//   authUser.authenticate('local',{
//     successRedirect: '/AdminPage', //On success redirect to home
//     failureRedirect: '/Admin/SignIn', //On failure redirect back to login page
//     failureFlash: true
//   })(req,res,next);
// })
// module.exports = app


// NOTE: There is some MAJOR and I mean MAJOR BULLSHIT happening on this page and it is mad fragile.
// I am so upset that its happening. Two issues, 1.) this page has an issue rendering over the
// orders, 2.) sometimes this page breaks admin login. To fix follow thise:
//
// Kill the server
// Delete the sessions
// Close the site
// restart server then re-open site
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const session = require('express-session');
const flash = require('express-flash')
const passport = require('passport')
require('../config/passport.js')(passport)
const {checkAdminAuthenticated, checkAuthenticated, checkNotAuthenticated} = require('../config/auth')


// DB config
const db = require('../config/keys').MongoURI
const Request = require('../models/requestModel')
const Admin = require('../models/adminModel')


app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())

function requireAdmin() {
  return function(req, res, next) {
    const {username} = req.body;

    Admin.findOne({ username:username }, function(err, admin) {
      if (err) { return next(err); }

      if(admin.admin == true){
        console.log(admin);
      }

      if (!admin) {
        // Do something - the user does not exist
      }

      if (!admin.admin) {
        res.redirect('/Users/Login')
      }

      // Hand over control to passport
      next();
    });
  }
}

// The requireAdmin function is the tits. We can actually now have admins in the users database and just authenticate from there.
// It is currently using the admin collection to authenticate users from. If we want users to be kept in the user collection we can
// do that as well, just need to set the admin field to true or false and it will authenticate if true.

//connect to mongodb
mongoose.set('useUnifiedTopology', true)
mongoose.set('useNewUrlParser', true)
mongoose.connect(db )

app.get('/Make_A_Post',checkAdminAuthenticated, (req,res)=>{
  res.render('adminBlog')
})
app.get("/SignIn", checkNotAuthenticated,(req,res) =>{
  res.render("adminLogin.ejs")
})
app.get('/Orders', checkAdminAuthenticated, (req, res) => {
  Request.find({}).then(results => {
    res.render('orders.ejs', {
      Orders: results
    });
  })
})
// Login Handle
app.post('/SignIn',requireAdmin(), (req,res, next)=>{
  passport.authenticate('authUser',{
    successRedirect: '/AdminPage', //On success redirect to home
    failureRedirect: '/Admin/SignIn', //On failure redirect back to login page
    session: true,
    failureFlash: true
  })(req,res,next);
})
module.exports = app
