const express = require ('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// Body parser needs to be added before crud handlers
// C = Create | POST
// R = Read | GET
// U = Update | PUT
// D = Delete |


    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended : true}));
MongoClient.connect('mongodb+srv://ehernandez:4TCTAp!!@tfo-tfs-vvepn.mongodb.net/tfsInventory?retryWrites=true&w=majority',
 {useUnifiedTopology: true},(err, client) => {
  if(err) return console.error(err);
  console.log("Connected to MongoDB");
  const db = client.db("tfsInventory");
  const quoteCollection = db.collection("Plants");

  app.listen(3000, function(){
    console.log('Listening on 3000');
  });

  app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');
    db.collection('Plants').find().toArray()
      .then(results => {
        // Similar to sendFile above accept we do not need to specify the
        // directory. It works just find I suppose
        res.render('inventoryTest.ejs', {plants: results})
      })
      .catch(error => console.error(error))
  })

  app.post("/plants", (req, res) => {
    quoteCollection.insertOne(req.body).then(
      result => {
        res.redirect('/')
      }).catch(error => console.error(error))
  });

});
