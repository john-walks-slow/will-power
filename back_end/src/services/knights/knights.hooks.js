const { authenticate } = require('@feathersjs/authentication').hooks;

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [
      // TODO: death punishment
      async function(context) {
        if (context.result.hp && context.result.hp <= 0) {
          let battle = await context.app
            .service('battles')
            .get(context.result._id);
          context.app.service('messages').create({
            userId: context.result._id,
            title: 'You Die',
            message: 'You lose all your hp :(',
            button: 'I won\'t give up'
          });
          await context.service._patch(context.result._id, { wp: 0 }, {});
          if (battle.levelProgress === 6) {
            await context.app.service('battles').patch(
              context.result._id,
              {},
              {
                query: { action: 'giveUpBossFight' }
              }
            );
          } else {
            await context.app.service('battles')._newBattle(context.result._id);
          }
        }
        context.result = await context.service.get(context.result._id);
        return context;
      }
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
