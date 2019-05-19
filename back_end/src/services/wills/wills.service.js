// Initializes the `wills` service on path `/wills`
// const createService = require('feathers-nedb');
// const createModel = require('../../models/wills.model');
const hooks = require('./wills.hooks');
const joinFind = require('../../utils/joinFind');
module.exports = function(app) {
  // const Model = createModel(app);
  // const paginate = app.get('paginate');

  // const options = {
  //   Model,
  //   paginate
  // };

  class WillsService {
    constructor() {}
    async find(params) {
      let commitmentsService = app.service('/wills/commitments');
      let perseverancesService = app.service('/wills/perseverances');
      let restraintsService = app.service('/wills/restraints');
      return await joinFind(
        [commitmentsService, perseverancesService, restraintsService],
        params
      );
    }
  }
  // Initialize our service with any options it requires
  app.use('/wills', new WillsService());

  // Get our initialized service so that we can register hooks
  const service = app.service('wills');

  service.hooks(hooks);
};
