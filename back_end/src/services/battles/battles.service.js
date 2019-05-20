// Initializes the `Monster` service on path `/monster`
const createService = require('feathers-nedb');
const createModel = require('../../models/battles.model');
const hooks = require('./battles.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };
  let service = createService(options);
  service.get = async function(id, params) {
    let result = await this._get(id, params);
    let monster = await app
      .service('battles/monster-types')
      .get(result.monsterTypeId);
    Object.assign(result, { maxHp: monster.maxHp, damage: monster.damage });
    return result;
  };
  // Initialize our service with any options it requires
  app.use('/battles', service);

  // Get our initialized service so that we can register hooks
  service = app.service('battles');
  service.hooks(hooks);
};
