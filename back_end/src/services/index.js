const battles = require('./battles/battles.service.js');
const users = require('./users/users.service.js');
const knights = require('./knights/knights.service.js');
const monsterTypes = require('./battles/monster-types/monster-types.service.js');
const equipments = require('./equipments/equipments.service.js');
const weaponTypes = require('./equipments/weapon-types/weapon-types.service.js');
const offHandTypes = require('./equipments/off-hand-types/off-hand-types.service.js');
const commitments = require('./wills/commitments/commitments.service.js');
const perseverances = require('./wills/perseverances/perseverances.service.js');
const restraints = require('./wills/restraints/restraints.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
  app.configure(battles);
  app.configure(users);
  app.configure(knights);
  app.configure(monsterTypes);
  app.configure(equipments);
  app.configure(weaponTypes);
  app.configure(offHandTypes);
  app.configure(commitments);
  app.configure(perseverances);
  app.configure(restraints);
};
