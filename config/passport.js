// const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
//
//
// // Loads in user model
// const User = require('../models/userModel')
//
//
// module.exports = function (authUser){
//   authUser.use(
//     'authUser',new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
//       //Match user
//       const user = User.findOne({username: username})
//       .then(user=>{
//         if(!user){
//           return done(null, false, {message: 'Incorrect Username'})
//         }
//         //Match password
//         bcrypt.compare(password, user.password, (err, isMatch)=>{
//           if(err) throw err;
//           if (isMatch) {
//             return done(null, user)
//           }else {
//             return done(null, false, {message: 'Incorrect password'})
//           }
//         })
//       })
//       .catch(err=>console.log(err));
//     })
//   )
//
//   authUser.serializeUser((user, done) =>{
//     done(null, user.id);
//   });
//
//   authUser.deserializeUser((id, done) =>{
//     User.findById(id, (err, user) => {
//       done(err, user);
//     });
//   });
// }

// All we need is this passport to make sure that everything works


// NOTE: This passport works fine for admin and user auth keep in case the next expirment breaks

const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


// Loads in user model
const User = require('../models/userModel')
const Admin = require('../models/adminModel')


module.exports = function (authUser){
  authUser.use(
    'authUser',new LocalStrategy({usernameField: 'username'}, (username, password, done)=>{
      //Match user
      const user = User.findOne({username: username})
      .then(user=>{
        if(!user){
          return done(null, false, {message: 'Incorrect Username'})
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

  authUser.serializeUser((user, done) =>{
    done(null, user.id);
  });

  authUser.deserializeUser((id, done) =>{
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });


  authUser.use(
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

  authUser.serializeUser((admin, done) =>{
    done(null, admin.id);
  });

  authUser.deserializeUser((id, done) =>{
    Admin.findById(id, (err, admin) => {
      done(err, admin);
    });
  });
}
