const assert = require('assert');
const app = require('../../src/app');

describe('\'restraints\' service', () => {
  it('registered the service', () => {
    const service = app.service('wills/restraints');

    assert.ok(service, 'Registered the service');
  });
});
