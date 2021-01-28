const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id }, config.secret);
};

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  var existingUser = null;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if the user already exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { return next(err); }
    // If a user with email does exist, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    };
    // If the user does not exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }
      // Respond to request indicating the user exists
      res.json({ token: tokenForUser(user) });
    });
  });
//  res.send({ success: 'true' });
};
