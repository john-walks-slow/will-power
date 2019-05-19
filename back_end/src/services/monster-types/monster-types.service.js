// Initializes the `monster-types` service on path `/monster-types`
const createService = require('feathers-nedb');
const createModel = require('../../models/monster-types.model');
const hooks = require('./monster-types.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/monster-types', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('monster-types');
  service.getRandomMonsterType = function() {
    Model.count({}, function(err, count) {
      if (!err && count > 0) {
        var skipCount = Math.floor(Math.random() * count);
        Model.find({})
          .skip(skipCount)
          .limit(1)
          .exec(function(err2, monster) {
            if (!err2) {
              return monster;
            }
          });
      }
    });
  };
  service.hooks(hooks);
};
