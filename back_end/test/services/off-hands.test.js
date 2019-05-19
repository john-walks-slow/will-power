const assert = require('assert');
const app = require('../../src/app');

describe('\'off-hand-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('equipments/off-hand-types');

    assert.ok(service, 'Registered the service');
  });
});
