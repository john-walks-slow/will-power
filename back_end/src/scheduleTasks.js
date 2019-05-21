var schedule = require('node-schedule');

function scheduleTasks(app) {
  schedule.scheduleJob('* * 0 * * *', function() {
    app.service('knight').checkoutWills();
  });
}

module.exports = scheduleTasks;
