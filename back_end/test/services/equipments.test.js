const assert = require('assert');
const app = require('../../src/app');

describe('\'equipments\' service', () => {
  it('registered the service', () => {
    const service = app.service('equipments');

    assert.ok(service, 'Registered the service');
  });
});
