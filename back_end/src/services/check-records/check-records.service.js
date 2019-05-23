// Initializes the `check-records` service on path `/wills/check-records`
const createService = require('feathers-nedb');
const createModel = require('../../models/check-records.model');
const hooks = require('./check-records.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/check-records', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/check-records');

  service.hooks(hooks);
};
