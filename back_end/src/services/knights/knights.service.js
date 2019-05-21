// Initializes the `knight` service on path `/knight`
const createService = require('feathers-nedb');
const createModel = require('../../models/knights.model');
const hooks = require('./knights.hooks');
const makePatchAction = require('../../utils/makePatchAction');
const _patchDelta = require('../../utils/_patchDelta');
const joinFind = require('../../utils/joinFind');
var moment = require('moment');

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
      let battleResult = await app
        .service('battles')
        ._patchDelta(original._id, {
          field: 'hp',
          delta: -damage,
          min: 0,
          stayOriginal: false,
          notify: true,
          usePrivate: false
        });
      return await this.get(original._id);
    }
  });
  service._attacked = async function(_id, amount = 1) {
    let original = await this.get(_id);
    let battle = await app.service('battles').get(_id);
    await this._patchDelta(_id, {
      field: 'wp',
      delta: -original.wp,
      min: 0,
      notify: false
    });
    return await this._patchDelta(_id, {
      field: 'hp',
      delta: -battle.damage * amount,
      min: 0,
      usePrivate: false,
      notify: true
    });
  };

  service._checkDailyWills = async function(_id) {
    let uncompleted = 0;
    let completed = 0;
    let serviceCommitment = app.service('wills/commitments');
    let serviceRestraint = app.service('wills/restraints');
    let servicePerseverance = app.service('wills/perseverances');
    let { data: commitments } = await serviceCommitment.find({
      query: { userId: _id, cycle: 'day' }
    });
    uncompleted += commitments.filter(c => c.progress < c.target).length;
    let { data: restraints } = await serviceRestraint.find({
      query: { userId: _id, cycle: 'day' }
    });
    completed += restraints.filter(c => c.progress <= c.target).length;
    let { data: perseverances } = await servicePerseverance.find({
      query: { userId: _id, cycle: 'day' }
    });
    uncompleted += perseverances.filter(c => c.progress < c.target).length;
    let original = await this.get(_id);
    await this._patchDelta(_id, {
      field: 'wp',
      max: original.maxWp,
      delta: 60 * completed,
      stayOriginal: false,
      notify: true
    });
    return await this._attacked(_id, uncompleted);
  };
  service._checkWeeklyWills = async function(_id) {
    let uncompleted = 0;
    let completed = 0;
    let serviceCommitment = app.service('wills/commitments');
    let serviceRestraint = app.service('wills/restraints');
    let servicePerseverance = app.service('wills/perseverances');
    let { data: commitments } = await serviceCommitment.find({
      query: { userId: _id, cycle: 'week' }
    });
    uncompleted += commitments.filter(c => c.progress < c.target).length;
    let { data: restraints } = await serviceRestraint.find({
      query: { userId: _id, cycle: 'week' }
    });
    completed += restraints.filter(c => c.progress <= c.target).length;
    let { data: perseverances } = await servicePerseverance.find({
      query: { userId: _id, cycle: 'week' }
    });
    uncompleted += perseverances.filter(c => c.progress < c.target).length;
    let original = await this.get(_id);
    await this._patchDelta(_id, {
      field: 'wp',
      max: original.maxWp,
      delta: 150 * completed,
      stayOriginal: false,
      notify: true
    });
    return await this._attacked(_id, uncompleted * 3);
  };
  // Initialize our service with any options it requires
  app.use('/knights', service);

  // Get our initialized service so that we can register hooks
  service = app.service('knights');
  service.hooks(hooks);
};
