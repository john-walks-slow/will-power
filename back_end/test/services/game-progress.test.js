const assert = require('assert');
const app = require('../../src/app');

describe('\'game-progress\' service', () => {
  it('registered the service', () => {
    const service = app.service('game-progress');

    assert.ok(service, 'Registered the service');
  });
});
