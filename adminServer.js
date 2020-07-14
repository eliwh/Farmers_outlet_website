// if(process.env.NODE_ENV !== 'production'){
//   require('dotenv').config()
// }
// const express = require ('express');
// const app = express()
// const bodyParser= require('body-parser')
// const session = require('express-session')
//
// //passport and authentication config
// const passport = require('passport')
// const authUser = new passport.Passport();
// require('./config/passport.js')(authUser)
// const adminPassport = new passport.Passport();
// require('./config/passport.js')(adminPassport)
// const {checkAuthenticated, checkNotAuthenticated, checkAdminAuthenticated} = require('./config/auth')
//
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// app.use(express.static('public'))
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
// // app.use(adminPassport.initialize())
// // app.use(adminPassport.session())
// app.use(authUser.initialize())
// app.use(authUser.session())
//   app.use('/Admin', require('./routes/adminRoute'))
//
//   const MongoClient = require('mongodb').MongoClient;
//
//   const db = require('./config/keys').MongoURI
//   MongoClient.connect(db, {useUnifiedTopology: true},(err, client) => {
//     if(err) return console.error(err);
//     console.log("Connected to MongoDB...");
//     var inventory = client.db("tfsInventory");
//     const plantsCollection = inventory.collection("Plants");
// //Admin page view
// app.get('/AdminPage',checkAdminAuthenticated, (req, res) => {
//   inventory.collection('Plants').find().toArray()
//       .then(results => {
//       res.render('inventory.ejs', {plants: results})
//     })
//     .catch(error => console.error(error))
// })
// });
//
// const PORT = process.env.PORT || 3500;
// app.listen(PORT, console.log(`Server started on' ${PORT}`));
// // http://localhost:3500/AdminPage
