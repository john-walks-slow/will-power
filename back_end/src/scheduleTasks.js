var schedule = require('node-schedule');

function scheduleTasks(app) {
  app.service('knights')._checkWeeklyWills('28TJjQKT3dFjxU4K');
  // schedule.scheduleJob('* * 0 * * *', function() {
  //   app.service('knight').checkoutWills();
  // });
}

module.exports = scheduleTasks;
