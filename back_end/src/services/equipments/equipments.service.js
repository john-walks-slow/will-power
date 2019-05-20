// Initializes the `equipments` service on path `/equipments`
const createService = require('feathers-nedb');
const createModel = require('../../models/equipments.model');
const joinGet = require('../../utils/joinGet');
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
      return;
    }
    let equipmentDetail = await joinGet(
      [
        app.service('equipments/off-hand-types'),
        app.service('equipments/weapon-types')
      ],
      equipment.typeId
    );
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
    let paySucceed = await app
      .service('knights')
      .patchGem(data.userId, -CREATE_COST);
    if (!paySucceed) {
      return;
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
  // Initialize our service with any options it requires
  app.use('/equipments', service);

  // Get our initialized service so that we can register hooks
  service = app.service('equipments');

  service.hooks(hooks);
};
