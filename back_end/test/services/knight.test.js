const assert = require('assert');
const app = require('../../src/app');

describe('\'knight\' service', () => {
  it('registered the service', () => {
    const service = app.service('knight');

    assert.ok(service, 'Registered the service');
  });
});
