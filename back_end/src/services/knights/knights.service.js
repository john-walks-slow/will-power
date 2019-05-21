// Initializes the `knight` service on path `/knight`
const createService = require('feathers-nedb');
const createModel = require('../../models/knights.model');
const hooks = require('./knights.hooks');
const makePatchAction = require('../../utils/makePatchAction');
const _patchDelta = require('../../utils/_patchDelta');
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
  const DEFAULT_DAMAGE = 20;
  const DEFAULT_WP_CONSUMPTION = 25;
  service.get = async function(id, params) {
    let result = await this._get(id, params);
    var { data: equippedOffHand } = await app.service('equipments').find({
      query: { userId: id, equipped: true, cat: 'offHand' }
    });
    equippedOffHand = equippedOffHand[0];
    let maxHp = equippedOffHand ? equippedOffHand.maxHp : DEFAULT_MAX_HP;
    let maxWp = equippedOffHand ? equippedOffHand.maxWp : DEFAULT_MAX_WP;
    if (result.hp > maxHp) {
      result.hp = maxHp;
      await this._patch(id, { hp: maxHp }, {});
    }
    if (result.wp > maxWp) {
      result.wp = maxWp;
      await this._patch(id, { wp: maxWp }, {});
    }
    result = Object.assign(result, {
      maxHp,
      maxWp
    });
    return result;
  };
  service._patchDelta = _patchDelta;
  service.patch = makePatchAction({
    async attack(original) {
      let { data: weapon } = await app
        .service('equipments')
        .find({ query: { cat: 'weapon', equipped: true } });
      weapon = weapon[0];
      let wpConsumption = weapon
        ? weapon.wpConsumption
        : DEFAULT_WP_CONSUMPTION;
      let damage = weapon ? weapon.damage : DEFAULT_DAMAGE;
      if (original.wp < wpConsumption) {
        return original;
      }
      let wpResult = await this._patchDelta(original._id, {
        field: 'wp',
        min: 0,
        stayOriginal: true,
        delta: -wpConsumption
      });
      if (!wpResult) {
        return;
      }
      await app.service('battles')._patchDelta(original._id, {
        field: 'hp',
        delta: -damage,
        min: 0,
        stayOriginal: false,
        notify: true
      });
      return wpResult;
    }
  });

  service.equip = async function() {};
  // Initialize our service with any options it requires
  app.use('/knights', service);

  // Get our initialized service so that we can register hooks
  service = app.service('knights');
  service.hooks(hooks);
};
