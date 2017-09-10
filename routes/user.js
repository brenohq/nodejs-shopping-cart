var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');
var User = require('../models/user');

var csrfProtection = csrf();

router.post('/removeUser', function(req, res, next) {
  User.findOneAndRemove({email: req.user.email}, function(err, success) {
    if(err) {
      console.log(err.message);
      req.flash('error', 'Failed to remove user!');
    }
    if(success) {
      req.flash('success', 'User successfully removed!');
      res.redirect('/');
    }
  });
});

router.use(csrfProtection);

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('user/profile', {
    csrfToken: req.csrfToken(),
    user: req.user
  });
});

router.post('/profile', function(req, res, next) {

  if (req.body.email) {
    User.findOne({
      email: req.body.email
    }, function(err, doc) {

      if (err) {
        req.flash('error', 'failed')
        console.log(err);
      }

      doc.email = req.body.email;

      doc.save();

    });
  } else {
    console.log("Invalid email");
  }

  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }

  res.end();

});

router.get('/orders', isLoggedIn, function(req, res, next) {
    Order.find({
        user: req.user
    }, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/orders', {
            csrfToken: req.csrfToken(),
            orders: orders,
        });
    });
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.get('/signin', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signin', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
  if (req.session.oldUrl) {
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/user/profile');
  }
});

router.use('/', notLoggedIn, function(req, res, next) {
  next();
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}