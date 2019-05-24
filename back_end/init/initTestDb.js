const NeDB = require('nedb');
let path = require('path');

let userModel = new NeDB({
  filename: path.join('../data', 'users.db'),
  autoload: true
});
userModel.insert({
  _id: 'test',
  nickname: 'test',
  email: 'test@test.com',
  password: 'test'
});
let perseveranceModel = new NeDB({
  filename: path.join('../data', 'perseverances.db'),
  autoload: true
});
perseveranceModel.insert({
  userId: 'test',
  name: 'testing',
  target: 2,
  cycle: 'day',
  _id: 'testPerseverance'
});
