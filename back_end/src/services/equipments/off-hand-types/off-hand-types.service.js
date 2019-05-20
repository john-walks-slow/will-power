// Initializes the `off-hand-types` service on path `/equipments/off-hand-types`
const createService = require('feathers-nedb');
const createModel = require('../../../models/off-hand-types.model');
const hooks = require('./off-hand-types.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/equipments/off-hand-types', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('equipments/off-hand-types');

  service.hooks(hooks);
};
