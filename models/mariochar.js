const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema and model
//Schema
const MarioCharSchema = new Schema({
  name: String,
  weight: Number
});

//Model
const MarioChar = mongoose.model('mariochar', MarioCharSchema);

module.exports = MarioChar;
