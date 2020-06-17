const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const schema = mongoose.Schema;


// Creating the schema model that will go into the collection
// The schema
const userSchema = new Schema({
  fName: String,
  lName: String,
  username: String,
  password: String
});

// Hasing the password A.k.A securing interval
userSchema.methods.generateHash = funtion(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
;

//Ensuring that the password is valid
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};
let User = mongoose.model('user', userSchema);
module.exports = User;
