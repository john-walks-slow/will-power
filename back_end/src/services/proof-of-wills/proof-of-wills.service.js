// Initializes the `proof-of-wills` service on path `/wills/proof-of-wills`
const createService = require('feathers-nedb');
const createModel = require('../../models/proof-of-wills.model');
const hooks = require('./proof-of-wills.hooks');
const findFromGets = require('../../utils/findFromGets');
const moment = require('moment');
module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };
  let service = createService(options);
  service.get = async function(id, params) {
    let now = moment();
    let result = await this._get(id, params);
    let powCount = 0;
    let { data: records } = await app
      .service('wills/check-records')
      .find({ query: { willId: result.willId, willType: result.willType } });
    if (records.length > 0) {
      records.forEach(record => {
        let recordDate = moment(record.date, 'D/M/YYYY');
        if (
          recordDate.isAfter(now.subtract(result.period, result.cycle + 's')) &&
          record.completed
        ) {
          powCount++;
        }
      });
    }
    if (powCount < result.target) {
      result.powType = undefined;
    }

    result.progress = powCount;
    return result;
  };
  service.find = findFromGets;
  service.create = async function(data, params) {
    let result = await this._create(data, params);
    result.powType = undefined;
    result.progress = 0;
    return result;
  };
  // Initialize our service with any options it requires
  app.use('/wills/proof-of-wills', service);

  // Get our initialized service so that we can register hooks
  service = app.service('wills/proof-of-wills');

  service.hooks(hooks);
};
