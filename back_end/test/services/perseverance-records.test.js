const assert = require('assert');
const app = require('../../src/app');

describe('\'perseverance-records\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/perseverance-records');

    assert.ok(service, 'Registered the service');
  });
});
