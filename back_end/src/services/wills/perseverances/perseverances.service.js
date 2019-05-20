// Initializes the `perseverances` service on path `/wills/perseverances`
const createService = require('feathers-nedb');
const createModel = require('../../../models/perseverances.model');
const hooks = require('./perseverances.hooks');

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
    let userId = await this._get(id).userId;
    switch (action) {
    case 'complete':
      await app.service('knights').patchWp(userId, {
        willType: 'perseverance'
      });
      break;
    default:
      break;
    }
    return await this._patch(id, data);
  };
  // Initialize our service with any options it requires
  app.use('/wills/perseverances', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/perseverances');

  service.hooks(hooks);
};
