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
    paginate,
    events: ['attacked']
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
  service._patchDelta = async function(_id, data) {
    let powReduceDamageRecieved = 1;
    let powIncreaseWpGain = 1;
    let powReduceWpConsumption = 1;
    let powIncreaseWillGemGain = 1;

    if (data.field === 'hp' && data.delta < 0) {
      let { data: willPows } = await app
        .service('wills/proof-of-wills')
        .find({ query: { userId: _id } });
      willPows.forEach(pow => {
        if (pow.powType == 'powReduceDamageRecieved') {
          powReduceDamageRecieved *= pow.ratio;
        }
      });
      data.delta /= powReduceDamageRecieved;
    }

    if (data.field === 'wp' && data.delta > 0) {
      let { data: willPows } = await app
        .service('wills/proof-of-wills')
        .find({ query: { userId: _id } });
      willPows.forEach(pow => {
        if (pow.powType == 'powIncreaseWpGain') {
          powIncreaseWpGain *= pow.ratio;
        }
      });
      data.delta *= powIncreaseWpGain;
    }
    if (data.field === 'wp' && data.delta < 0) {
      let { data: willPows } = await app
        .service('wills/proof-of-wills')
        .find({ query: { userId: _id } });
      willPows.forEach(pow => {
        if (pow.powType == 'powReduceWpConsumption') {
          powReduceWpConsumption *= pow.ratio;
        }
      });
      data.delta /= powReduceWpConsumption;
    }
    if (data.field === 'willGem' && data.delta > 0) {
      let { data: willPows } = await app
        .service('wills/proof-of-wills')
        .find({ query: { userId: _id } });
      willPows.forEach(pow => {
        if (pow.powType == 'powIncreaseWillGemGain') {
          powIncreaseWillGemGain *= pow.ratio;
        }
      });
      data.delta *= powIncreaseWillGemGain;
    }
    return await _patchDelta.apply(this, [_id, data]);
  };
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
  service._attacked = async function(_id, damageSource = undefined) {
    let original = await this.get(_id);
    let battle = await app.service('battles').get(_id);
    await this._patchDelta(_id, {
      field: 'wp',
      delta: -original.wp,
      min: 0,
      notify: false
    });
    if (damageSource) {
      app.service('messages').create({
        userId: original._id,
        title: 'You Are Attacked When You Are Offline',
        message: `Source: ${damageSource.reduce(
          (i, c) => c + ',' + i
        )} Damage: ${battle.damage * damageSource.length} (${battle.damage}*${
          damageSource.length
        })`,
        button: '>_<'
      });
    }
    this.emit('attacked', { data: undefined });
    return await this._patchDelta(_id, {
      field: 'hp',
      delta: -battle.damage,
      min: 0,
      usePrivate: false,
      notify: true
    });
  };

  service._checkWills = async function(_id, cycle) {
    let serviceCommitment = app.service('wills/commitments');
    let serviceRestraint = app.service('wills/restraints');
    let servicePerseverance = app.service('wills/perseverances');
    let { data: commitments } = await serviceCommitment.find({
      query: { userId: _id, cycle: cycle }
    });
    let uncompleted = [];
    let completed = [];
    commitments.forEach(c => {
      app.service('wills/check-records').create({
        userId: _id,
        willType: 'commitment',
        willId: c._id,
        completed: c.progress >= c.target,
        date: moment().format('D/M/YYYY')
      });
      if (c.progress < c.target) {
        uncompleted.push(c.name);
      }
    });
    let { data: perseverances } = await servicePerseverance.find({
      query: { userId: _id, cycle: cycle }
    });
    perseverances.forEach(c => {
      app.service('wills/check-records').create({
        userId: _id,
        willType: 'perseverance',
        willId: c._id,
        completed: c.progress >= c.target,
        date: moment().format('D/M/YYYY')
      });
      if (c.progress < c.target) {
        uncompleted.push(c.name);
      }
    });
    let { data: restraints } = await serviceRestraint.find({
      query: { userId: _id, cycle: cycle }
    });
    restraints.forEach(c => {
      app.service('wills/check-records').create({
        userId: _id,
        willType: 'restraint',
        willId: c._id,
        completed: c.progress <= c.target,
        date: moment().format('D/M/YYYY')
      });
      if (c.progress > c.target) {
        completed.push(c.name);
      }
    });
    let original = await this.get(_id);

    if (uncompleted.length > 0) {
      this._attacked(_id, uncompleted);
    } else {
      this._patchDelta(_id, {
        field: 'wp',
        max: original.maxWp,
        delta: 60 * completed.length,
        stayOriginal: false,
        notify: true
      });
    }
  };

  // Initialize our service with any options it requires
  app.use('/knights', service);

  // Get our initialized service so that we can register hooks
  service = app.service('knights');
  service.hooks(hooks);
};
