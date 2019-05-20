const { authenticate } = require('@feathersjs/authentication').hooks;
const initWill = require('../../../hooks/initWill');
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [initWill()],
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
