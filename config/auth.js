module.exports ={
  checkAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
      return next()
    }
    // req.flash('error_msg', 'please login to view this resource')
    res.redirect('/Users/Login')
  },
  checkNotAuthenticated: function(req,res,next){
    if(req.isAuthenticated()){
      return res.redirect('/')
    }
    // req.flash('error_msg', 'please login to view this resource')
    return next()
  },

  checkAdminAuthenticated: function(req,res,next){
    if(req.isAuthenticated() && req.user.access == 'Admin'){
      return next()
    }
    // req.flash('error_msg', 'please login to view this resource')
    res.redirect('http://localhost:3000/Admin/SignIn')
  },
  checkAdminNotAuthenticated: function(req,res,next){
    if(req.isAuthenticated() && req.user.access == 'Admin'){
      res.redirect('http://localhost:3000/AdminPage')
    }
    // req.flash('error_msg', 'please login to view this resource')
    return next()
  }
}
