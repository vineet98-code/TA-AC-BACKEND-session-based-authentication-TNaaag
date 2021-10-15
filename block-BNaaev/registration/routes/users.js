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

router.get('/login', function(req, res, next) {
  res.render('login.ejs');
});


module.exports = router;
