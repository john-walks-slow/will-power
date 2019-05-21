let transformBoolean = require('../../hooks/transformBoolean');
const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [transformBoolean()],
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
    patch: [
      // Tell knight to recalculate max hp and max wp
      async function(context) {
        let newKnight = await context.app
          .service('knights')
          .get(context.result.userId);
        context.app.service('knights').emit('updated', newKnight);
        return context;
      }
    ],
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
