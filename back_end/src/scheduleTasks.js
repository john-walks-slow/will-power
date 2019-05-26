var schedule = require('node-schedule');

async function scheduleTasks(app) {
  schedule.scheduleJob('0 0 23 * * *', async function() {
    let { data: users } = await app.service('users').find({});
    for (let user of users) {
      app.service('knights')._checkWills(user._id, 'day');
    }
  });
  schedule.scheduleJob('0 0 23 * * 7', async function() {
    let { data: users } = await app.service('users').find({});
    for (let user of users) {
      app.service('knights')._checkWills(user._id, 'week');
    }
  });
}

module.exports = scheduleTasks;
