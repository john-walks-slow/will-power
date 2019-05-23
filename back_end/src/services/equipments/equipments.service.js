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
      equipmentDetail.damage = Math.round(
        equipmentDetail.damage * Math.pow(1.5, equipment.tier - 1)
      );
      equipmentDetail.wpConsumption = Math.round(
        equipmentDetail.wpConsumption * Math.pow(1.1, equipment.tier - 1)
      );
    }
    if (equipment.cat === 'offHand') {
      equipmentDetail = await app
        .service('equipments/off-hand-types')
        .get(equipment.typeId);
      equipmentDetail.maxHp = Math.round(
        equipmentDetail.maxHp * Math.pow(1.3, equipment.tier - 1)
      );
      equipmentDetail.maxWp = Math.round(
        equipmentDetail.maxWp * Math.pow(1.3, equipment.tier - 1)
      );
    }
    return Object.assign(equipmentDetail, equipment);
  };
  service.find = async function(params) {
    var results = await this._find(params);
    for (let equipment of results.data) {
      Object.assign(equipment, await this.get(equipment._id));
    }
    return results;
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
    let tier;
    random = Math.random();
    if (random >= 0.93) {
      tier = 3;
    } else if (random >= 0.85) {
      tier = 2;
    } else {
      tier = 1;
    }
    let createResult = await this._create({
      userId: data.userId,
      equipped: false,
      typeId: resultType._id,
      tier: tier,
      acuiredTime: new Date().getTime(),
      cat: resultType.cat
    });
    let result = Object.assign(resultType, createResult);
    app.service('messages').create({
      title: 'New Equipment',
      message: `You forge a tier ${result.tier} ${result.name}`,
      button: 'Great!'
    });
    return result;
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
    },
    async advance(original) {
      var { data: sameEquipment } = await this._find({
        query: { typeId: original.typeId, tier: original.tier }
      });
      sameEquipment = sameEquipment.filter(e => e._id !== original._id);
      if (sameEquipment.length >= 1) {
        let consume = sameEquipment[0];
        this._remove(consume._id, {});
        this.emit('removed', { _id: consume._id });
        let result = await this._patchDelta(original._id, {
          field: 'tier',
          delta: 1,
          usePrivate: true
        });
        result = await this.get(original._id);
        app.service('messages').create({
          userId: original.userId,
          title: 'Advance Succeed',
          message: `Your ${result.name} is now Tier ${result.tier}.`,
          button: 'Great!'
        });
        return result;
      } else {
        app.service('messages').create({
          userId: original.userId,
          title: 'Advance Fail',
          message: 'You need 2 identical equipments to advance.',
          button: 'I understand'
        });
        return original;
      }
    }
  });
  service._patchDelta = _patchDelta;
  service.remove = async function(id, params) {
    let equipment = await this.get(id);
    await app.service('knights')._patchDelta(equipment.userId, {
      field: 'willGem',
      delta:
        equipment.rarity *
        equipment.rarity *
        15 *
        Math.pow(2, equipment.tier - 1),
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
