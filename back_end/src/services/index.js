const monsters = require('./monsters/monsters.service.js');
const users = require('./users/users.service.js');
const gameProgress = require('./game-progress/game-progress.service.js');
const knights = require('./knights/knights.service.js');
const monsterTypes = require('./monster-types/monster-types.service.js');
const equipments = require('./equipments/equipments.service.js');
const wills = require('./wills/wills.service.js');
const weaponTypes = require('./weapon-types/weapon-types.service.js');
const offHandTypes = require('./off-hand-types/off-hand-types.service.js');
const commitments = require('./commitments/commitments.service.js');
const perseverances = require('./perseverances/perseverances.service.js');
const restraints = require('./restraints/restraints.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(monsters);
  app.configure(users);
  app.configure(gameProgress);
  app.configure(knights);
  app.configure(monsterTypes);
  app.configure(equipments);
  app.configure(wills);
  app.configure(weaponTypes);
  app.configure(offHandTypes);
  app.configure(commitments);
  app.configure(perseverances);
  app.configure(restraints);
};
