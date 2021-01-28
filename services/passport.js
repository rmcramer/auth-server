const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('Authorization'),
  secretOrKey: config.secret
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload, done) {
  //See if the user ID in the payload exists in our DB, if so,
  //call done with that user, otherwise done with no user object
  console.log(payload);
  User.findById(payload.sub, function(err,user) {
    if (err) return done(err,false);

    if (user) {
      return done(null,user);
    } else {
      return done(null,false);
    }
  });
});

//Tell Passport to use this strategy
passport.use(jwtLogin);
