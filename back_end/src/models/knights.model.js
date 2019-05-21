const NeDB = require('nedb');
const path = require('path');

module.exports = function(app) {
  const dbPath = app.get('nedb');
  const Model = new NeDB({
    filename: path.join(dbPath, 'knights.db'),
    autoload: true
  });
  Model.ensureIndex({ fieldName: '_id', unique: true });
  return Model;
};
