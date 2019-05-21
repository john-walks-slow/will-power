// Initializes the `perseverance-records` service on path `/wills/perseverance-records`
const createService = require('feathers-nedb');
const createModel = require('../../../../models/perseverance-records.model');
const hooks = require('./perseverance-records.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/perseverance-records', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/perseverance-records');

  service.hooks(hooks);
};
