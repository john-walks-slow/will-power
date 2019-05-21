const assert = require('assert');
const app = require('../../src/app');

describe('\'restraint-records\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/restraint-records');

    assert.ok(service, 'Registered the service');
  });
});
