const Authentication = require('./controllers/authentication');
const passposrtService = require('./services/passport');
const passport = require('passport');
// const jwt = require('jwt-simple');
// const config = require('./config');

const requireAuth = passport.authenticate('jwt',{ session: false });
const requireSignin = passport.authenticate('local',{ session: false });

module.exports = function(app) {
//  app.get('/',function(req,res) { console.log(jwt.decode(req.headers.authorization,config.secret)); }, requireAuth, function(req,res) {
  app.get('/', requireAuth, function(req,res) {
    res.send({ hi: 'there' });
  });

  app.post('/signup', Authentication.signup);
  app.post('/signin', requireSignin, Authentication.signin);
};
