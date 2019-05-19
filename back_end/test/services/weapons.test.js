const assert = require('assert');
const app = require('../../src/app');

describe('\'weapon-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('equipments/weapon-types');

    assert.ok(service, 'Registered the service');
  });
});
