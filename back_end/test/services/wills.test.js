const assert = require('assert');
const app = require('../../src/app');

describe('\'wills\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills');

    assert.ok(service, 'Registered the service');
  });
});
