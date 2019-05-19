const assert = require('assert');
const app = require('../../src/app');

describe('\'Monster\' service', () => {
  it('registered the service', () => {
    const service = app.service('monster');

    assert.ok(service, 'Registered the service');
  });
});
