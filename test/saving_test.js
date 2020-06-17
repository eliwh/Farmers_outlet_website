const mocha = require('mocha'); // Apparently we dont need this but I bet it is good to have
const assert = require('assert');
const MarioChar = require('../models/mariochar');

//Describe tests
describe('Saving records', function(){
  //Create tests
  it('Saves a record to the database', function(done){

    var char = new MarioChar({
      name:'Mario'
    });

    char.save().then(function(){
      assert(char.isNew === false);
      done();
    });
  });
});
