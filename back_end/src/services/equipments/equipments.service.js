// Initializes the `equipments` service on path `/equipments`
const createService = require('feathers-nedb');
const createModel = require('../../models/equipments.model');
const hooks = require('./equipments.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/equipments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('equipments');

  service.hooks(hooks);
};
