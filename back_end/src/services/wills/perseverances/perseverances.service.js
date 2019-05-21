// Initializes the `perseverances` service on path `/wills/perseverances`
const createService = require('feathers-nedb');
const createModel = require('../../../models/perseverances.model');
const hooks = require('./perseverances.hooks');
const makePatchAction = require('../../../utils/makePatchAction');
const sameDay = require('../../../utils/sameDay');
var moment = require('moment');

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
      progress = records
        .filter(r => sameDay(new Date(r.time), new Date()))
        .reduce((i, current) => {
          return i + current.progress;
        }, 0);
    } else if (result.cycle === 'week') {
      progress = records
        .filter(r => !moment(new Date(r.time)).isBefore(moment(), 'week'))
        .reduce((i, current) => {
          return i + current.progress;
        }, 0);
    }
    return Object.assign(result, { records, progress });
  };
  service.find = async function(params) {
    var results = await this._find(params);
    for (let perseverance of results.data) {
      Object.assign(perseverance, await this.get(perseverance._id));
    }
    return results;
  };
  service.create = async function(data, params) {
    let result = await service._create(data, params);
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
};
