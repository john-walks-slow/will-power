// Initializes the `wills` service on path `/wills`
const createService = require('feathers-nedb');
const createModel = require('../../models/wills.model');
const hooks = require('./wills.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills');

  service.hooks(hooks);
};
