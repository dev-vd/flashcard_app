var users = require('../../app/controllers/users.server.controller')
    flashcards = require('../../app/controllers/flashcards.server.controller');

module.exports = function(app){

  app.route('/flashcards')
     .get(users.listFlashcards);

  app.route('/flashcard')
    .get(users.requiresLogin, users.renderCreate)
    .post(users.requiresLogin, users.createFlashcard);

};