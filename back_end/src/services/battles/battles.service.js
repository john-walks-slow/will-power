// Initializes the `Monster` service on path `/monster`
const createService = require('feathers-nedb');
const createModel = require('../../models/battles.model');
const hooks = require('./battles.hooks');
const _patchDelta = require('../../utils/_patchDelta');
const makePatchAction = require('../../utils/makePatchAction');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');
  const CRITICAL_HIT_POSSIBILITY = 0.05;
  const CRITICAL_HIT_DAMAGE = 5;

  const options = {
    Model,
    paginate
  };
  const MONSTERS_EVERY_LEVEL = 5;
  function calculateMonster(monster, level) {
    return {
      name: monster.name,
      maxHp: Math.round(monster.maxHp * Math.pow(1.6, level - 1)),
      damage: Math.round(monster.damage * Math.pow(1.2, level - 1))
    };
  }
  function calculateBoss(monster, level) {
    return {
      name: monster.name,
      maxHp: Math.round(monster.maxHp * Math.pow(2, level - 1)) * level,
      damage: Math.round(monster.damage * Math.pow(1.2, level))
    };
  }
  let service = createService(options);
  service.get = async function(id, params) {
    let result = await this._get(id, params);
    let monster = await app
      .service('battles/monster-types')
      .get(result.monsterTypeId);
    Object.assign(
      result,
      result.levelProgress === MONSTERS_EVERY_LEVEL + 1
        ? calculateBoss(monster, result.level)
        : calculateMonster(monster, result.level)
    );
    return result;
  };
  service._newBattle = async function(id) {
    let original = await this._get(id);
    let { data: types } = await app.service('battles/monster-types').find();
    let resultTypeIndex = Math.floor(Math.random() * types.length);
    let resultType = types[resultTypeIndex];
    // generate level
    // recover hp
    let knight = await app.service('knights').get(original._id);
    await app.service('knights').patch(original._id, {
      hp: knight.maxHp
    });
    await this._patch(
      original._id,
      {
        monsterTypeId: resultType._id
      },
      {}
    );
    let result = await this.get(original._id);
    result = await this._patch(
      original._id,
      {
        hp: result.maxHp
      },
      {}
    );
    this.emit('patched', await this.get(original._id));
    return result;
  };
  service._progressLevel = async function(id, boss = false) {
    let original = await this.get(id);
    let levelSucceed;
    if (original.levelProgress === MONSTERS_EVERY_LEVEL + 1) {
      await this._patchDelta(original._id, {
        field: 'level',
        delta: 1,
        notify: false,
        usePrivate: true
      });
      levelSucceed = await this._patch(original._id, { levelProgress: 1 }, {});
    } else {
      levelSucceed = await this._patchDelta(original._id, {
        field: 'levelProgress',
        delta: 1,
        max: MONSTERS_EVERY_LEVEL + (boss ? 1 : 0),
        stayOriginal: true,
        nullIfStay: false,
        notify: false,
        usePrivate: true
      });
    }
    return await this._newBattle(id);
  };
  service.patch = makePatchAction({
    async giveUpBossFight(original) {
      if (original.levelProgress !== MONSTERS_EVERY_LEVEL + 1) {
        return original;
      }
      let { data: types } = await app.service('battles/monster-types').find();
      let resultTypeIndex = Math.floor(Math.random() * types.length);
      let resultType = types[resultTypeIndex];
      // generate level
      await this._patchDelta(original._id, {
        field: 'levelProgress',
        delta: -1,
        notify: false,
        usePrivate: true
      });
      this._progressLevel(original._id);
    },
    async enterBossFight(original) {
      if (original.levelProgress !== MONSTERS_EVERY_LEVEL) {
        return original;
      }
      this._progressLevel(original._id, true);
    }
  });
  service._patchDelta = async function(_id, data) {
    let powIncreaseDamage = 1;
    let powIncreaseCriticalHitPossibility = 1;
    let powIncreaseCriticalHitDamage = 1;
    if (data.field === 'hp' && data.delta < 0) {
      let { data: willPows } = await app
        .service('wills/proof-of-wills')
        .find({ query: { userId: _id } });
      willPows.forEach(pow => {
        if (pow.powType == 'powIncreaseDamage') {
          powIncreaseDamage *= pow.ratio;
        }
        if (pow.powType == 'powIncreaseCriticalHitPossibility') {
          powIncreaseCriticalHitPossibility *= pow.ratio;
        }
        if (pow.powType == 'powIncreaseCriticalHitDamage') {
          powIncreaseCriticalHitDamage *= pow.ratio;
        }
      });
    }
    let random = Math.random();
    if (
      random >
      1 - powIncreaseCriticalHitPossibility * CRITICAL_HIT_POSSIBILITY
    ) {
      data.delta *= CRITICAL_HIT_DAMAGE * powIncreaseCriticalHitDamage;
    }
    data.delta *= powIncreaseDamage;
    return await _patchDelta.apply(this, [_id, data]);
  };
  // Initialize our service with any options it requires
  app.use('/battles', service);

  // Get our initialized service so that we can register hooks
  service = app.service('battles');
  service.hooks(hooks);
};
