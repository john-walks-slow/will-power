// Initializes the `Monster` service on path `/monster`
const createService = require('feathers-nedb');
const createModel = require('../../models/monsters.model');
const hooks = require('./monsters.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    id: 'attackingUserId'
  };

  // Initialize our service with any options it requires
  app.use('/monsters', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('monsters');
  service.hooks(hooks);
};
