// Initializes the `restraints` service on path `/wills/restraints`
const createService = require('feathers-nedb');
const createModel = require('../../../models/restraints.model');
const hooks = require('./restraints.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };
  let service = createService(options);
  service.patch = async function(id, data, params) {
    if (!params || !params.query || !params.query.action) {
      return await this._patch(id, data, params);
    }
    let { action } = params.query;
    let currentRestraint = await this._get(id);
    switch (action) {
    case 'fail':
      data = {
        progress: currentRestraint.progress + 1
      };
      break;
    default:
      break;
    }
    return await this._patch(id, data, {});
  };
  // Initialize our service with any options it requires
  app.use('/wills/restraints', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/restraints');

  service.hooks(hooks);
};
