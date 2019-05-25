// Initializes the `perseverances` service on path `/wills/perseverances`
const createService = require('feathers-nedb');
const createModel = require('../../../models/perseverances.model');
const hooks = require('./perseverances.hooks');
const makePatchAction = require('../../../utils/makePatchAction');
const sameDay = require('../../../utils/sameDay');
const findFromGets = require('../../../utils/findFromGets');
var moment = require('moment');

const POW_TYPES = [
  'powIncreaseDamage',
  'powReduceDamage',
  'powIncreaseCriticalHitPossibility',
  'powIncreaseCriticalHitDamage',
  'powReduceWpConsumption',
  'powIncreaseWpGain',
  'powIncreaseWillGemGain'
];
const POW_MAP = {
  day: [
    { target: 3, period: 3, ratio: 1.5 },
    { target: 7, period: 8, ratio: 1.5 },
    { target: 30, period: 33, ratio: 3 },
    { target: 60, period: 70, ratio: 3 },
    { target: 100, period: 110, ratio: 6 },
    { target: 200, period: 220, ratio: 6 },
    { target: 300, period: 330, ratio: 10 }
  ],
  week: [
    { target: 2, period: 2, ratio: 1.5 },
    { target: 4, period: 5, ratio: 1.5 },
    { target: 6, period: 8, ratio: 3 },
    { target: 9, period: 11, ratio: 3 },
    { target: 16, period: 19, ratio: 6 },
    { target: 32, period: 37, ratio: 6 },
    { target: 48, period: 56, ratio: 10 }
  ]
};

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
    let { data: records } = await app
      .service('wills/perseverance-records')
      .find({ query: { perseveranceId: id } });
    let progress;
    if (result.cycle === 'day') {
      progress = records.filter(r => sameDay(new Date(r.time), new Date()))
        .length;
    } else if (result.cycle === 'week') {
      progress = records.filter(
        r => !moment(new Date(r.time)).isBefore(moment(), 'week')
      ).length;
    }
    return Object.assign(result, { records, progress });
  };
  service.find = findFromGets;
  service.create = async function(data, params) {
    let result = await service._create(data, params);
    for (let pow of POW_MAP[result.cycle]) {
      let random = Math.floor(Math.random() * POW_TYPES.length);
      await app.service('wills/proof-of-wills').create({
        userId: result.userId,
        willId: result._id,
        willType: 'perseverance',
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
    async complete(original) {
      var knight = await app.service('knights').get(original.userId);
      await app.service('knights')._patchDelta(original.userId, {
        field: 'wp',
        max: knight.maxWp,
        delta: Math.round(
          (original.progress < original.target
            ? (1 / original.target) * (original.cycle === 'day' ? 1 : 3)
            : 0) * 50
        ),
        stayOriginal: false,
        notify: true
      });
      await app.service('wills/perseverance-records').create({
        perseveranceId: original._id,
        time: new Date().getTime()
      });
      return await this.get(original._id);
    }
  });
  // Initialize our service with any options it requires
  app.use('/wills/perseverances', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/perseverances');

  service.hooks(hooks);
  // // test
  // service.create({
  //   userId: 'test',
  //   name: 'testing',
  //   target: 2,
  //   cycle: 'day',
  //   _id: 'testPerseverance'
  // });
};
