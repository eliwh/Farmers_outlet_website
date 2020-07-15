if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require ('express');
const app = express()
const flash = require('express-flash')
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const session = require('express-session')
const ejs = require('ejs');
const methodOverride = require('method-override')
const MongoClient = require('mongodb').MongoClient;

const db = require('./config/keys').MongoURI
//helllloooo
//passport and authentication config
const passport = require('passport')
const authUser = new passport.Passport();
require('./config/passport.js')(authUser)
const adminPassport = new passport.Passport();
require('./config/passport.js')(adminPassport)
const {checkAuthenticated, checkNotAuthenticated} = require('./config/auth')

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
    app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    }))
    // app.use(adminPassport.initialize())
    // app.use(adminPassport.session())
    app.use(authUser.initialize())
    app.use(authUser.session())
    app.use(methodOverride('_method'))
    app.use('/Users', require('./routes/userRoute'))
    app.use('/Admin', require('./routes/adminRoute'))


// Here we are connectng to MongoDB. All of our CRUD operations
// are going to be done within the mongodb function
MongoClient.connect(db, {useUnifiedTopology: true},(err, client) => {
  if(err) return console.error(err);
  console.log("Connected to MongoDB...");
  var inventory = client.db("tfsInventory");
  const plantsCollection = inventory.collection("Plants");

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, console.log(`Listening on port ${PORT}...`));

//Home page
app.get('/',checkAuthenticated,(req, res) => {
  res.render('home.ejs', {name: req.user.username})
})

app.get('/Blog', (req, res) => {
  res.render('blog.ejs')
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
      res.render('inventory.ejs', {plants: results})
    })
    .catch(error => console.error(error))
})
//Inventory Routes
// NOTE: done
  app.post("/plants", (req, res) => {
    plantsCollection.insertOne(req.body).then(
      result => {
        res.redirect('/AdminPage')
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
    .then(result => {
      res.json('Success')
      res.redirect('inventory.ejs')
    })
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
