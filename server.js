const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const fs = require ('fs');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// Body parser needs to be added before crud handlers
// C = Create | POST
// R = Read | GET
// U = Update | PUT
// D = Delete | Self explanatory fam


    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

// Here we are connectng to MongoDB. All of our CRUD operations are going to be done within the mongodb function

// NOTE: This is where @Elijah was tinkering around with the inventory back end. Elijah will be looking in how we can
// use these concepts for other scripts. I.e having multiple JavaScript files for specific operations on the db like
// reflecting inventory that was posted, user login, blog posts and exedra so that the files are organized.

app.use(bodyParser.urlencoded({extended : true}));
MongoClient.connect('mongodb+srv://ehernandez:4TCTAp!!@tfo-tfs-vvepn.mongodb.net/tfsInventory?retryWrites=true&w=majority',
 {useUnifiedTopology: true},(err, client) => {
  if(err) return console.error(err);
  console.log("Connected to MongoDB");
  var db = client.db("tfsInventory");
  var usersDB = client.db("userAccounts");
  const plantsCollection = db.collection("Plants");
  const accountsCollection = usersDB.collection("Users");

  app.listen(3000, function(){
    console.log('Listening on 3000');
  });


//Home page (Currently admin inventory)
app.get('/', (req, res) => {
  db.collection('Plants').find().toArray()
    .then(results => {
      res.render('home.ejs')
    })
    .catch(error => console.error(error))
})

//Admin page view
  app.get('/Admin Page', (req, res) => {
    db.collection('Plants').find().toArray()
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
    const hashedPwd = await bcrypt.hash(req.body.password, 10)
    accountsCollection.insertOne(
      {
        email: req.body.email,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        password: hashedPwd
      }).then(
        result =>{
          res.redirect('/Login')
        }).catch(error => console.log(error))
  });

  // TODO: Create login route
  // Login Route
  app.get('/Login', (req,res) => {
    usersDB.collection('Users').find().toArray()
      .then(results  => {
        // Similar to sendFile above accept we do not need to specify the
        // directory. It works just find I suppose
        res.render('usrLogin.ejs')
      })
      .catch(error => console.error(error))

  })

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
