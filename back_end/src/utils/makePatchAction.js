module.exports = actionsMap =>
  async function(id, data, params) {
    if (!params || !params.query || !params.query.action) {
      return await this._patch(id, data, params);
    }
    let { action } = params.query;
    let original = await this.get(id);
    if (!actionsMap.hasOwnProperty(action)) {
      return original;
    }
    return await actionsMap[action].apply(this, [original, data]);
  };
