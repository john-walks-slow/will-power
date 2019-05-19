const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword,
  protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [hashPassword(), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      // function initUserData(context) {
      //   context.app.service('/knights').create({
      //     userId: context.result._id,
      //     hp: 50,
      //     wp: 50,
      //     appearance: 'KnightMale'
      //   });
      //   context.app.service('/game-progress').create({
      //     userId: context.result._id,
      //     level: 1,
      //     levelProgress: 0,
      //     willGem: 0
      //   });
      //   context.app.service('/game-progress').nextLevel();
      // }
    ],
    update: [],
    patch: [],
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
