const mongoose = require('mongoose');

//ES6 Pro,ise
mongoose.Promise = global.Promise;
//Connect to database before tests run i.e mocha hook
before(function(done){
  //Connect to mongodb locally
  mongoose.set('useFindAndModify', false);// Without this we would get a deprecation warning
  mongoose.set('useUnifiedTopology', true); // if not set then we will get deprication warning (Server)
  mongoose.connect('mongodb+srv://ehernandez:4TCTAp!!@tfo-tfs-vvepn.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true});// If not set then we will get another depreication // WARNING:


  mongoose.connection.once('open',function(){
    console.log('Connection established to MongoDB!');
    done();
  }).on('error', function(error){
    console.log('Connection error:', error);
  });
});

//Drop the characters collection before each test.
beforeEach(function(done){
  //Drop the collection
  //references all the collections in the database
  mongoose.connection.collections.mariochars.drop(function(){
    done();
  });  //plural because mongoose pluralizes automatically and we need to refer to that
});
