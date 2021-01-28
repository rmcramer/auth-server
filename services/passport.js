const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //Verify this username/password, call done with user or false
  User.findOne({email: email}, function(err,user) {
    if (err) return done(err);
    if (!user) return done(null,false);
    user.comparePassword(password,function(err,isMatch){
      if (err) return done(err);
      if (!isMatch) return done(null,false);
      return done(null,user);
    });
  });
});

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload, done) {
  //See if the user ID in the payload exists in our DB, if so,
  //call done with that user, otherwise done with no user object
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
passport.use(localLogin);
