const monster = require('./monster/monster.service.js');
const users = require('./users/users.service.js');
const gameProgress = require('./game-progress/game-progress.service.js');
const knight = require('./knights/knights.service.js');
const monsterTypes = require('./monster-types/monster-types.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(monster);
  app.configure(users);
  app.configure(gameProgress);
  app.configure(knight);
  app.configure(monsterTypes);
};
