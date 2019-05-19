// Initializes the `knight` service on path `/knight`
const createService = require('feathers-nedb');
const createModel = require('../../models/knights.model');
const hooks = require('./knights.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    id: 'userId'
  };

  // Initialize our service with any options it requires
  app.use('/knights', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('knights');
  service.hooks(hooks);
};
