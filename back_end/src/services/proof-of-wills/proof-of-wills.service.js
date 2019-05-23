// Initializes the `proof-of-wills` service on path `/wills/proof-of-wills`
const createService = require('feathers-nedb');
const createModel = require('../../models/proof-of-wills.model');
const hooks = require('./proof-of-wills.hooks');
const moment = require('moment');
module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };
  let service = createService(options);
  service.find = async function(params) {
    let { data: pows } = await this._find(params);
    let { data: records } = await app
      .service('wills/check-records')
      .find({ query: { willId: params.willId, willType: params.willType } });
    let now = moment();
    pows.forEach(pow => {
      let powCount = 0;
      records.forEach(record => {
        let recordDate = moment(record.day, 'D/M/YYYY');
        if (
          recordDate.isAfter(now.subtract(pow.period, pow.cycle + 's')) &&
          record.completed
        ) {
          powCount++;
        }
      });
      if (powCount < pow.target) {
        pow.powType = undefined;
      }
    });
    return { data: pows };
  };
  service.create = async function(data, params) {
    let result = await this._create(data, params);
    result.powType = undefined;
    return result;
  };
  // Initialize our service with any options it requires
  app.use('/wills/proof-of-wills', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/proof-of-wills');

  service.hooks(hooks);
};
