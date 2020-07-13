const express = require ('express');
const app = express()
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const passport = require('passport')
const session = require('express-session')
const MongoClient = require('mongodb').MongoClient;
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
    app.use('/Users', require('./routes/userRoute'))
    app.use('/Admin', require('./routes/adminRoute'))

// Here we are connectng to MongoDB. All of our CRUD operations
// are going to be done within the mongodb function
app.use(bodyParser.urlencoded({extended : true}));
MongoClient.connect(db, {useUnifiedTopology: true},(err, client) => {
  if(err) return console.error(err);
  console.log("Connected to MongoDB...");
  var inventory = client.db("tfsInventory");
  const plantsCollection = inventory.collection("Plants");

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
        res.render('inventory.ejs', {plants: results})
      })
      .catch(error => console.error(error))
  })
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
