// Initializes the `commitments` service on path `/wills/commitments`
const createService = require('feathers-nedb');
const createModel = require('../../../models/commitments.model');
const hooks = require('./commitments.hooks');

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
    let currentTime = new Date().getTime();
    switch (action) {
    case 'start':
      data.lastCommitmentStartTime = currentTime;
      break;
    case 'complete':
      await app.service('knights').patchWp(userId, {
        willType: 'commitment',
        progress: currentTime - data.lastCommitmentStartTime
      });
      break;
    default:
      break;
    }
    return await this._patch(id, data);
  };
  // Initialize our service with any options it requires
  app.use('/wills/commitments', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/commitments');

  service.hooks(hooks);
};
