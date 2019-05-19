const assert = require('assert');
const app = require('../../src/app');

describe('\'monster-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('monster-types');

    assert.ok(service, 'Registered the service');
  });
});
