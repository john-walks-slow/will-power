// Initializes the `commitment-records` service on path `/wills/commitment-records`
const createService = require('feathers-nedb');
const createModel = require('../../../../models/commitment-records.model');
const hooks = require('./commitment-records.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/commitment-records', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/commitment-records');

  service.hooks(hooks);
};
