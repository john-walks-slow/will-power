// Initializes the `users` service on path `/users`
const createService = require('feathers-nedb');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    events: ['initStart', 'initComplete']
  };
  let service = createService(options);
  service.find = async function(params) {
    if (!params || !params.query || !params.query.leaderboard) {
      return await this._find(params);
    } else {
      let { data: topBattles } = await app.service('battles').find({
        query: { $sort: { level: -1, levelProgress: -1 }, $limit: 10 }
      });
      for (let battle of topBattles) {
        let user = await this.get(battle._id);
        Object.assign(battle, { nickname: user.nickname });
      }
      return topBattles;
    }
  };
  // Initialize our service with any options it requires
  app.use('/users', Object.assign(service));

  // Get our initialized service so that we can register hooks
  service = app.service('users');
  service.hooks(hooks);

  // // test
  // service.create({
  //   _id: 'test',
  //   nickname: 'test',
  //   email: 'test@test.com',
  //   password: 'test'
  // });
  // service.create({
  //   _id: 'test2',
  //   nickname: 'test2',
  //   email: 'test2@test2.com',
  //   password: 'test2'
  // });
  // service.create({
  //   _id: 'test3',
  //   nickname: 'test3',
  //   email: 'test3@test3.com',
  //   password: 'test3'
  // });
};
