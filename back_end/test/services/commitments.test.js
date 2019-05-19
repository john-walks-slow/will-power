const assert = require('assert');
const app = require('../../src/app');

describe('\'commitments\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/commitments');

    assert.ok(service, 'Registered the service');
  });
});
