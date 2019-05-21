const { authenticate } = require('@feathersjs/authentication').hooks;
const MONSTERS_EVERY_LEVEL = 5;
async function progressLevelIfMonsterDie(context) {
  if (context.result.hp && context.result.hp <= 0) {
    // gain will gem
    await context.app.service('knights')._patchDelta(context.result._id, {
      field: 'willGem',
      delta: Math.round(Math.random() * 30 + context.result.level * 10),
      notify: true
    });
    // progress level
    context.result = await context.service._progressLevel(context.result._id);
  }
  return context;
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [progressLevelIfMonsterDie],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
