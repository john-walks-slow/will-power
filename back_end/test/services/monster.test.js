const assert = require('assert');
const app = require('../../src/app');

describe('\'Monsters\' service', () => {
  it('registered the service', () => {
    const service = app.service('monsters');

    assert.ok(service, 'Registered the service');
  });
});
