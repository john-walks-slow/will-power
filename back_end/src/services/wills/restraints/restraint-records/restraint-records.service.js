// Initializes the `restraint-records` service on path `/wills/restraint-records`
const createService = require('feathers-nedb');
const createModel = require('../../../../models/restraint-records.model');
const hooks = require('./restraint-records.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/restraint-records', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/restraint-records');

  service.hooks(hooks);
};
