// Initializes the `commitments` service on path `/wills/commitments`
const createService = require('feathers-nedb');
const createModel = require('../../../models/commitments.model');
const hooks = require('./commitments.hooks');
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
      .service('wills/commitment-records')
      .find({ query: { commitmentId: id } });
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
    for (let commitment of results.data) {
      Object.assign(commitment, await this.get(commitment._id));
    }
    return results;
  };
  service.create = async function(data, params) {
    let result = await service._create(data, params);
    return await this.get(result._id);
  };
  service.patch = makePatchAction({
    async start(original) {
      original.lastCommitmentStartTime = new Date().getTime();
      return await this._patch(original._id, original, {});
    },
    async complete(original) {
      var knight = await app.service('knights').get(original.userId);
      let currentTime = new Date().getTime();
      var delta = Math.round(
        (currentTime - original.lastCommitmentStartTime) / 50000
      );
      // var progress = Math.round(
      //   (currentTime - original.lastCommitmentStartTime) / 60000
      // );
      var progress = Math.round(
        (currentTime - original.lastCommitmentStartTime) / 6000
      );

      await app.service('knights')._patchDelta(original.userId, {
        field: 'wp',
        max: knight.maxWp,
        delta: delta,
        stayOriginal: false,
        notify: true
      });
      if (progress > 0) {
        await app.service('wills/commitment-records').create({
          commitmentId: original._id,
          time: currentTime,
          progress: progress
        });
      }
      await this._patch(
        original._id,
        {
          lastCommitmentStartTime: null
        },
        {}
      );
      return await this.get(original._id);
    }
  });

  // Initialize our service with any options it requires
  app.use('/wills/commitments', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/commitments');

  service.hooks(hooks);
};
