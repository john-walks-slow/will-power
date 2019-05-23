const assert = require('assert');
const app = require('../../src/app');

describe('\'check-records\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/check-records');

    assert.ok(service, 'Registered the service');
  });
});
