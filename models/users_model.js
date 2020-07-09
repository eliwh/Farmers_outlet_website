const mongoose = require('mongoose');
Schema = mongoose.Schema;

var userSchema = new Schema ({
  usernmae: {type: String, Unique: true},
  email: {type: String, Unique: true},
  first_name: String,
  last_name: String,
  hashedPwd: String
});

mongoose.model('user', userSchema);
