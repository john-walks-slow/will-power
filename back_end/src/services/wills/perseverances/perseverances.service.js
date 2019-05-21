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
    let currentPerseverance = await this._get(id);
    var knight = await app.service('knights').get(currentPerseverance.userId);

    switch (action) {
    case 'complete':
      await app.service('knights')._patchDelta(currentPerseverance.userId, {
        field: 'wp',
        max: knight.maxWp,
        delta: Math.floor(
          (currentPerseverance.progress < currentPerseverance.target
            ? (1 / currentPerseverance.target) *
                (currentPerseverance.cycle === 'day' ? 1 : 2)
            : 0) * 50
        ),
        stayOriginal: false,
        notify: true
      });
      data = { progress: currentPerseverance.progress + 1 };
      break;
    default:
      break;
    }
    return await this._patch(id, data, {});
  };
  // Initialize our service with any options it requires
  app.use('/wills/perseverances', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/perseverances');

  service.hooks(hooks);
};
