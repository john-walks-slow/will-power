// Initializes the `Monster` service on path `/monster`
const createService = require('feathers-nedb');
const createModel = require('../../models/monster.model');
const hooks = require('./monster.hooks');

module.exports = function(app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    id:"attackingUserId"
  };

  // Initialize our service with any options it requires
  app.use('/monster', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('monster');
  service.knightAttack = userId => {
    let docMonster;
    let docKnight;
    Model.find({ attackingUserId: userId }, function(err, docs) {
      docMonster = docs[0];
      app.service('knights').find({ query: { userId: userId } }).then({data}=>data[0]._id);
      app.service('knights').update();
    });
  };
  service.hooks(hooks);
};
