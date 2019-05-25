module.exports = async function(params) {
  var results = await this._find(params);
  for (let result of results.data) {
    Object.assign(result, await this.get(result._id));
  }
  return results;
};
