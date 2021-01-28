const Authentication = require('./controllers/authentication');
const passposrtService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt',{ session: false });

module.exports = function(app) {
  app.post('/signup', Authentication.signup);
  app.get('/',requireAuth, function(req,res) {
    res.send({ hi: 'there' });
  });
};
