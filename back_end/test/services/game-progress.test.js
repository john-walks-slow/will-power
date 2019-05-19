const assert = require('assert');
const app = require('../../src/app');

describe('\'gameProgress\' service', () => {
  it('registered the service', () => {
    const service = app.service('game-progress');

    assert.ok(service, 'Registered the service');
  });
});
