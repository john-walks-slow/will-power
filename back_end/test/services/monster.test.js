const assert = require('assert');
const app = require('../../src/app');

describe('\'battles\' service', () => {
  it('registered the service', () => {
    const service = app.service('battles');

    assert.ok(service, 'Registered the service');
  });
});
