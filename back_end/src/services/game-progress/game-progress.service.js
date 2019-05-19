// Initializes the `game-progress` service on path `/game-progress`
const createService = require('feathers-nedb');
const createModel = require('../../models/game-progress.model');
const hooks = require('./game-progress.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    id: 'userId'
  };

  // Initialize our service with any options it requires
  app.use('/game-progress', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('game-progress');

  service.hooks(hooks);
};
