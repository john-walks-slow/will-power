// Initializes the `perseverances` service on path `/wills/perseverances`
const createService = require('feathers-nedb');
const createModel = require('../../models/perseverances.model');
const hooks = require('./perseverances.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/perseverances', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/perseverances');

  service.hooks(hooks);
};
