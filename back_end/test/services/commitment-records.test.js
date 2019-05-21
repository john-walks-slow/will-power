const assert = require('assert');
const app = require('../../src/app');

describe('\'commitment-records\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/commitment-records');

    assert.ok(service, 'Registered the service');
  });
});
