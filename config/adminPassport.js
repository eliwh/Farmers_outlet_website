const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// Loads in user model
const Admin = require('../models/adminModel')

module.exports = function (adminPassport){
  adminPassport.use(
    new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
      //Match user
      Admin.findOne({username: username})
      .then(user=>{
        if(!user){
          return done(null, false, {message: 'That email is not register'})
        }
        //Match password
        bcrypt.compare(password, user.password, (err, isMatch)=>{
          if(err) throw err;
          if (isMatch) {
            return done(null, user)
          }else {
            return done(null, false, {message: 'Incorrect password'})
          }
        })
      })
      .catch(err=>console.log(err));
    })
  )

  adminPassport.serializeUser((user, done) =>{
    done(null, user.id);
  });

  adminPassport.deserializeUser((id, done) =>{
    Admin.findById(id, (err, user) => {
      done(err, user);
    });
  });

}



// NOTE: There is an issue in passport that needs to be found. The issue is not allowing me to access the admin login
