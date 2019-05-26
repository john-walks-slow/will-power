// Initializes the `restraints` service on path `/wills/restraints`
const createService = require('feathers-nedb');
const createModel = require('../../../models/restraints.model');
const hooks = require('./restraints.hooks');
const makePatchAction = require('../../../utils/makePatchAction');
const sameDay = require('../../../utils/sameDay');
const findFromGets = require('../../../utils/findFromGets');
var moment = require('moment');
const POW_MAP = require('../powMap');
const POW_TYPES = require('../powTypes');

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
    let { data: records } = await app.service('wills/restraint-records').find({
      query: {
        restraintId: id
      }
    });
    let progress;
    if (result.cycle === 'day') {
      progress = records.filter(r => sameDay(new Date(r.time), new Date()))
        .length;
    } else if (result.cycle === 'week') {
      progress = records.filter(
        r => !moment(new Date(r.time)).isBefore(moment(), 'week')
      ).length;
    }
    return Object.assign(result, {
      records,
      progress
    });
  };
  service.find = findFromGets;
  service.create = async function(data, params) {
    let result = await service._create(data, params);
    for (let pow of POW_MAP[result.cycle]) {
      let random = Math.floor(Math.random() * POW_TYPES.length);
      await app.service('wills/proof-of-wills').create({
        userId: result.userId,
        willId: result._id,
        willType: 'restraint',
        cycle: result.cycle,
        target: pow.target,
        period: pow.period,
        ratio: pow.ratio,
        powType: POW_TYPES[random]
      });
    }
    return await this.get(result._id);
  };
  service.patch = makePatchAction({
    async fail(original) {
      if (original.progress >= original.target) {
        await app.service('knights')._attacked(original.userId);
      }
      await app.service('wills/restraint-records').create({
        restraintId: original._id,
        time: new Date().getTime()
      });
      return await this.get(original._id);
    }
  });

  // Initialize our service with any options it requires
  app.use('/wills/restraints', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/restraints');

  service.hooks(hooks);
  // // test
  // service.create({
  //   userId: 'test3',
  //   name: 'testingRestraing',
  //   target: 2,
  //   cycle: 'day',
  //   _id: 'testRestraint'
  // });
};
