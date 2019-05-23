const assert = require('assert');
const app = require('../../src/app');

describe('\'proof-of-wills\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/proof-of-wills');

    assert.ok(service, 'Registered the service');
  });
});
