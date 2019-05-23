// Initializes the `dialogues` service on path `/dialogues`
const createService = require('feathers-nedb');
const createModel = require('../../models/dialogues.model');
const hooks = require('./dialogues.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/dialogues', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dialogues');

  service.hooks(hooks);
};
