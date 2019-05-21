// Initializes the `Monster` service on path `/monster`
const createService = require('feathers-nedb');
const createModel = require('../../models/battles.model');
const hooks = require('./battles.hooks');
const _patchDelta = require('../../utils/_patchDelta');
const makePatchAction = require('../../utils/makePatchAction');

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
  service.generateLevel = async function(data) {
    let { data: types } = await app.service('battles/monster-types').find();
    let resultTypeIndex = Math.floor(Math.random() * types.length);
    let resultType = types[resultTypeIndex];
    let createResult = await this._create({
      userId: data.userId,
      equipped: false,
      typeId: resultType._id,
      acuiredTime: new Date().getTime(),
      cat: resultType.cat
    });
    return Object.assign(resultType, createResult);
  };
  service._patchDelta = _patchDelta;
  // Initialize our service with any options it requires
  app.use('/battles', service);

  // Get our initialized service so that we can register hooks
  service = app.service('battles');
  service.hooks(hooks);
};
