// Initializes the `equipments` service on path `/equipments`
const createService = require('feathers-nedb');
const createModel = require('../../models/equipments.model');
const _patchDelta = require('../../utils/_patchDelta');
const makePatchAction = require('../../utils/makePatchAction');
const joinFind = require('../../utils/joinFind');

const hooks = require('./equipments.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  const CREATE_COST = 100;

  let service = createService(options);
  service.get = async function(id, params) {
    let equipment = await this._get(id, params);
    if (!equipment) {
      return {};
    }
    var equipmentDetail;
    if (equipment.cat === 'weapon') {
      equipmentDetail = await app
        .service('equipments/weapon-types')
        .get(equipment.typeId);
    }
    if (equipment.cat === 'offHand') {
      equipmentDetail = await app
        .service('equipments/off-hand-types')
        .get(equipment.typeId);
    }
    return Object.assign(equipmentDetail, equipment);
  };
  service.find = async function(params) {
    try {
      var results = await this._find(params);
    } catch (e) {
      console.log(e);
    }
    let composedResults = { data: [] };
    for (let equipment of results.data) {
      var equipmentDetail;
      if (equipment.cat === 'weapon') {
        equipmentDetail = await app
          .service('equipments/weapon-types')
          .get(equipment.typeId);
      }
      if (equipment.cat === 'offHand') {
        equipmentDetail = await app
          .service('equipments/off-hand-types')
          .get(equipment.typeId);
      }
      equipment = Object.assign(equipmentDetail, equipment);
      composedResults.data.push(equipment);
    }
    return composedResults;
  };
  service.create = async function(data) {
    let payResult = await app.service('knights')._patchDelta(data.userId, {
      field: 'willGem',
      delta: -CREATE_COST,
      min: 0,
      stayOriginal: true,
      notify: true
    });
    if (!payResult) {
      return {};
    }
    let rarity = 1;
    let random = Math.random();
    if (random >= 0.97) {
      rarity = 5;
    } else if (random >= 0.9) {
      rarity = 4;
    } else if (random >= 0.8) {
      rarity = 3;
    } else if (random >= 0.5) {
      rarity = 2;
    } else {
      rarity = 1;
    }
    let { data: types } = await joinFind(
      [
        app.service('equipments/weapon-types'),
        app.service('equipments/off-hand-types')
      ],
      { query: { rarity: rarity } }
    );
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
  service.patch = makePatchAction({
    async equip(original) {
      var { data: prevEquipped } = await this._find({
        query: { equipped: true, cat: original.cat }
      });
      for (let prev of prevEquipped) {
        let patchResult = await this._patch(prev._id, { equipped: false }, {});
        this.emit('patched', patchResult);
      }
      return await this._patch(original._id, { equipped: true }, {});
    },
    async unequip(original) {
      return await this._patch(original._id, { equipped: false }, {});
    }
  });

  service.remove = async function(id, params) {
    let equipment = await this.get(id);
    await app.service('knights')._patchDelta(equipment.userId, {
      field: 'willGem',
      delta: equipment.rarity * equipment.rarity * 10,
      notify: true
    });
    return await this._remove(id, params);
  };
  // Initialize our service with any options it requires
  app.use('/equipments', service);

  // Get our initialized service so that we can register hooks
  service = app.service('equipments');

  service.hooks(hooks);
};
