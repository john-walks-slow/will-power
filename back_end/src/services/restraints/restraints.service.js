// Initializes the `restraints` service on path `/wills/restraints`
const createService = require('feathers-nedb');
const createModel = require('../../models/restraints.model');
const hooks = require('./restraints.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/restraints', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/restraints');

  service.hooks(hooks);
};
