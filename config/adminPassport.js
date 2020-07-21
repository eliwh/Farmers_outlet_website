const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// Loads in user model
const Admin = require('../models/adminModel')


module.exports = function (adminPassport){
  adminPassport.use(
    'admin',new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
      //Match user
      const admin = Admin.findOne({username: username})
      .then(admin=>{
        if(!admin){
          return done(null, false, {message: 'Incorrect Username'})
        }
        //Match password
        bcrypt.compare(password, admin.password, (err, isMatch)=>{
          if(err) throw err;
          if (isMatch) {
            return done(null, admin)
          }else {
            return done(null, false, {message: 'Incorrect password'})
          }
        })
      })
      .catch(err=>console.log(err));
    })
  )

  adminPassport.serializeUser((admin, done) =>{
    done(null, admin.id);
  });

  adminPassport.deserializeUser((id, done) =>{
    Admin.findById(id, (err, admin) => {
      done(err, admin);
    });
  });
}
