// Initializes the `weapon-types` service on path `/equipments/weapon-types`
const createService = require('feathers-nedb');
const createModel = require('../../../models/weapon-types.model');
const hooks = require('./weapon-types.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };
  let service = createService(options);

  // Initialize our service with any options it requires
  app.use('/equipments/weapon-types', service);

  // Get our initialized service so that we can register hooks
  service = app.service('equipments/weapon-types');

  service.hooks(hooks);
};
