var schedule = require('node-schedule');

async function scheduleTasks(app) {
  schedule.scheduleJob('0 0 23 * * *', async function() {
    let { data: users } = await app.service('users').find({});
    for (let user of users) {
      app.service('knights')._checkDailyWills(user._id);
    }
  });
  schedule.scheduleJob('0 0 23 * * 7', async function() {
    let { data: users } = await app.service('users').find({});
    for (let user of users) {
      app.service('knights')._checkWeeklyWills(user._id);
    }
  });
  // // test
  // var { data: users } = await app.service('users').find({});
  // for (let user of users) {
  //   app.service('knights')._checkDailyWills(user._id);
  // }
  // var { data: users2 } = await app.service('users').find({});
  // for (let user of users2) {
  //   app.service('knights')._checkWeeklyWills(user._id);
  // }
}
module.exports = scheduleTasks;
