let user = require ('../models/users.js');

app.post('/register', function(req, res){
  let new_user = new User({
    username: req.username;
  });
});

new_user.password = new_user.generateHash(userInfo.password);
new_user.save();
});

app.post('/login', function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) {

    if (!user.validPassword(req.body.password)) {
      //password did not match
    } else {
      // password matched. proceed forward
    }
  });
});
