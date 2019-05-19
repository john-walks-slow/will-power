const assert = require('assert');
const app = require('../../src/app');

describe('\'perseverances\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/perseverances');

    assert.ok(service, 'Registered the service');
  });
});
