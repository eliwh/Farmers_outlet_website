if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const fs = require ('fs');
const multer = require('multer');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const MongoClient = require('mongodb').MongoClient;
const app = express();
const initializePassport = require('./passport-config.js')
// DB config
const db = require('./config/keys').MongoURI
// Body parser needs to be added before crud handlers
// C = Create | POST
// R = Read | GET
// U = Update | PUT
// D = Delete | Self explanatory fam


    // ========================
    // Middlewares
    // ========================

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(express.static('public'))
    app.use(flash())
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized:false
    }))
    app.use(passport.initialize())
    app.use(passport.session())

// NOTE: Connecting to mongoose here. testing to see if we can have two mongo conenctions, one for a mongoose model for UserSchema
// and one for just all the other stuffs
mongoose.set('useUnifiedTopology', true)
mongoose.connect(db, {useNewUrlParser:true})
const User = require('./models/User')
console.log(User);
// Here we are connectng to MongoDB. All of our CRUD operations
// are going to be done within the mongodb function
app.use(bodyParser.urlencoded({extended : true}));
MongoClient.connect(db, {useUnifiedTopology: true},(err, client) => {
  if(err) return console.error(err);
  console.log("Connected to MongoDB...");
  var inventory = client.db("tfsInventory");
  var usersDB = client.db("userAccounts");
  const plantsCollection = inventory.collection("Plants");
  const accountsCollection = usersDB.collection("Users");

  initializePassport(
    passport,
    email => accountsCollection.findOne(user => user.email == email),
    id => accountsCollection.findOne(user => user.id == id)
  )

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, console.log(`Listening on port ${PORT}...`));


//Home page
app.get('/', (req, res) => {
  res.render('home.ejs')
})

app.get('/Produce', (req, res) => {
  inventory.collection('Plants').find().toArray()
    .then(results => {
      res.render('produce.ejs')
    })
    .catch(error => console.error(error))
})
app.get('/Contact', (req, res) => {
  inventory.collection('Plants').find().toArray()
    .then(results => {
      res.render('contact.ejs')
    })
    .catch(error => console.error(error))
})
//Admin page view
  app.get('/AdminPage', (req, res) => {
    inventory.collection('Plants').find().toArray()
      .then(results => {
        res.render('inventoryTest.ejs', {plants: results})
      })
      .catch(error => console.error(error))
  })

// User account routes

// Signup Route
// NOTE: Can create users and insert them into mongodb. The passwords
// are also encrypted. To finalize this we need to authenticate them.
  app.get('/Signup', (req,res) => {
    usersDB.collection('Users').find().toArray()
      .then(results  => {
        res.render('usrSignup.ejs')
      })
      .catch(error => console.error(error))

  })

  app.post("/Users", async (req,res)=>{
  //   const hashedPwd = await bcrypt.hash(req.body.password, 10)
  //   accountsCollection.insertOne(
  //     {
  //       email: req.body.email,
  //       first_name: req.body.firstName,
  //       last_name: req.body.lastName,
  //       username: req.body.username,
  //       password: hashedPwd
  //     }).then(
  //       result =>{
  //         res.redirect('/Login')
  //       }).catch(error => console.log(error))
  // });
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('usrLogin.ejs', {
      errors: reqerrors,
      name: name,
      email,
      password,
      password2
    });
  } else {
    accountsCollection.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('usrLogin.ejs', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

          //Hashing password for security
          bcrypt.genSalt(10, (err,salt)=>
            bcrypt.hash(newUser.password, salt, (err,hash)=>{
              if (err) throw err;
              // Setting the password to the hashed password
              newUser.password = hash
              // Save user to mongodb
              accountsCollection.insertOne(newUser)
              .then(user =>{
                res.redirect('/login')
              })
              .catch(err => console.log(err))
          }))
        }
      })
      .catch()
    }
  });

  // TODO: Create login route
  // Login Route
  app.get('/Login', (req,res) => {
    res.render('usrLogin.ejs')
  })
  app.post('/Login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/Login',
    failureFlash: true
  }))

  // TODO: Create admin login route
  //  AdminLogin Route
  app.get('/adminLogin.ejs', (req,res) => {
    usersDB.collection('Users').find().toArray()
      .then(results  => {
        // Similar to sendFile above accept we do not need to specify the
        // directory. It works just find I suppose
        res.render('adminLogin.ejs')
      })
      .catch(error => console.error(error))

  })
  // User Order Request Routes
  // TODO:

  // Admin Order Routes
  // TODO:

//Inventory Routes
// NOTE: done
  app.post("/plants", (req, res) => {
    plantsCollection.insertOne(req.body).then(
      result => {
        res.redirect('/')
      }).catch(error => console.error(error))
  });

  app.put('/Plants', (req, res) => {
  plantsCollection.findOneAndUpdate(

    // Important to specify that the filter is not empty
      {Type: req.body.type}, //<---- filter
      {
        // Important to note that the fields you will be updating must match
        // exactly. This means that they are case sensitive as well.

        // $Set is our query. Here we are updating the fields via user input.
        // The code is from main.js
        $set: {
          Type: req.body.type,
          Name: req.body.name,
          Quantity: req.body.quantity
        }
      }
    )
    .then(result => {res.json('Success')})
    .catch(error => console.error(error))
  })
    app.delete('/Plants', (req,res) => {
    plantsCollection.deleteOne(
      {Name: req.body.name},
    )
    .then(result => {
      if (result.deletedCount === 0) {
        return res.json('Item Not Found')
      }
      res.json(`Deleted Inventory Item`)
     })
     .catch(error => console.error(error))
  })
});
