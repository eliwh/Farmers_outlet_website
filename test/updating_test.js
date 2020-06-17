const mocha = require('mocha'); // Apparently we dont need this but I bet it is good to have
const assert = require('assert');
const MarioChar = require('../models/mariochar');

//Describe tests
describe('Updating records', function(){

var char;

beforeEach(function(done){
  char = new MarioChar({
    name:'Mario',
    weight: 50
  });

  char.save().then(function(){
    done();
  });
});

  //Create tests
  it('updates one record in the database', function(done){
    MarioChar.findOneAndUpdate({name: 'Mario'}, {name: 'Luigi'}).then(function(){
      MarioChar.findOne({_id: char._id}).then(function(result){
        assert(result.name === 'Luigi');
        done();
      });
    });
  });

  it('Increments the weight by 1', function(done){
    MarioChar.updateOne({},{$inc: {weight: 1}}).then(function(){
      MarioChar.findOne({name: 'Mario'}).then(function(record){
        assert(record.weight === 51)
        done();
      });
    });
  });
});
