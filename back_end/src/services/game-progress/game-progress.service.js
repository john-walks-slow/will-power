// Initializes the `gameProgress` service on path `/game-progress`
const createService = require('feathers-nedb');
const createModel = require('../../models/game-progress.model');
const hooks = require('./game-progress.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    id: 'userId'
  };

  // Initialize our service with any options it requires
  app.use('/game-progress', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('game-progress');

  service.nextLevel = userId => {
    let monster = app.service('monster-types').getRandomMonsterType();
    app.service('monster').create({
      monsterType: monster.monsterType,
      hp: monster.maxHp,
      attackingUserId: userId
    });
    service.get(({ userId: userId }, function(err, docs) {
      let newLevelProgress;
      let newLevel;
      if (levelProgress <= 9) {
        newLevelProgress = docs[0].levelProgress + 1;
      } else if (levelProgress == 11) {
        newLevel = docs[0].level + 1;
        newLevelProgress = 1;
        Model.update(
          { userId: userId },
          { level: newLevel, levelProgress: newLevelProgress },
          {}
          function(err, numReplaced) {}
              );
      }
    })
  }
  service.hooks(hooks);
};
