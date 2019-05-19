// Initializes the `commitments` service on path `/wills/commitments`
const createService = require('feathers-nedb');
const createModel = require('../../models/commitments.model');
const hooks = require('./commitments.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wills/commitments', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('wills/commitments');

  service.hooks(hooks);
};
