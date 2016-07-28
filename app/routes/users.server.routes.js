var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app){

  app.route('/signup')
    .get(users.renderSignup)
    .post(users.signup);

  app.route('/signin')
    .get(users.renderSignin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true
    }));

  app.route('/next')
    .get(users.next);

  app.route('/nextGotIt')
    .post(users.GotIt);

  app.route('/nextNotGotIt')
    .post(users.NotGotIt);

  app.route('/')

  app.get('/signout', users.signout);
};