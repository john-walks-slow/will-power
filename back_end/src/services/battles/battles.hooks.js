const { authenticate } = require('@feathersjs/authentication').hooks;
const MONSTERS_EVERY_LEVEL = 5;
async function progressLevelIfMonsterDie(context) {
  if (context.result.hp && context.result.hp <= 0) {
    let delta = Math.round((Math.random() + 1) * context.result.level * 25);
    // gain will gem
    if (context.result.levelProgress === 6) {
      delta *= context.result.level * 2;
    }
    await context.app.service('knights')._patchDelta(context.result._id, {
      field: 'willGem',
      delta,
      notify: true
    });
    await context.app.service('messages').create({
      title: 'Congratulations',
      message:
        'You defeat the monster and gain ' + delta.toString() + ' will gems.',
      button: 'Great!'
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
