// Initializes the `knight` service on path `/knight`
const createService = require('feathers-nedb');
const createModel = require('../../models/knights.model');
const hooks = require('./knights.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };
  let service = createService(options);
  const DEFAULT_MAX_HP = 50;
  const DEFAULT_MAX_WP = 50;
  service.get = async function(id, params) {
    let result = await this._get(id, params);
    var { data: equippedOffHand } = await app.service('equipments').find({
      query: { userId: id, equipped: true, cat: 'offHand' }
    });
    equippedOffHand = equippedOffHand[0];
    result = Object.assign(result, {
      maxHp: equippedOffHand ? equippedOffHand.maxHp : DEFAULT_MAX_HP,
      maxWp: equippedOffHand ? equippedOffHand.maxWp : DEFAULT_MAX_WP
    });
    return result;
  };
  service.patch = async function(id, data, params) {
    if (!params || !params.query || !params.query.action) {
      return await this._patch(id, data, params);
    }
    let { action } = params.query;
    switch (action) {
    case 'attack':
      break;
    default:
      break;
    }
  };
  service.patchWp = async function(userId, { willType, progress }) {
    let original = await this.get(userId);
    let originalWp = original.wp;
    let maxWp = original.maxWp;
    let delta;
    switch (willType) {
    case 'commitment':
      delta = 50;
      break;
    case 'perseverance':
      break;
    case 'restraint':
      break;
    default:
      break;
    }
    if (originalWp + delta > maxWp) {
      return await this._patch(userId, { wp: maxWp });
    }
    return await this._patch(userId, { wp: originalWp + delta });
  };

  service.patchGem = async function(userId, delta) {
    let original = await this.get(userId);
    let originalWillGem = original.willGem;
    if (originalWillGem + delta < 0) {
      return null;
    }
    return await this.patch(userId, {
      willGem: originalWillGem + delta
    });
  };

  service.equip = async function() {};
  // Initialize our service with any options it requires
  app.use('/knights', service);

  // Get our initialized service so that we can register hooks
  service = app.service('knights');
  service.hooks(hooks);
};
