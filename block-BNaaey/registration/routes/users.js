var express = require('express');
var router = express.Router();

var User = require('../models/User');


router.get('/', function(req, res, next) {
  res.render('users');
});


// create user
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, createUser) => { // user.create going to invoked same hooks internally by mongo
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    res.redirect('/users/login');
  })
});


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var { email, password } = req.body;
  if(!email || !password){
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    console.log(req.body, user);
     if(err) return next(err);
     if(!user){
      //  if user is not there we do not want to reach verify password i.e use return
       return res.redirect('/users/login');
     } 
     // if user is not null
    //  user schema and verify paswword from models
     user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        res.redirect('/users/login');
      }
      // to uniquely identified the user who login creating uniquely session
      req.session.userId = user.id;

      res.redirect('/dashboard');

      // login user
     })

  })
 
});



module.exports = router;