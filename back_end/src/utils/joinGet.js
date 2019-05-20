module.exports = async function joinGet(services, id, params) {
  let results = {};
  for (let service of services) {
    try {
      var result = await service.get(id, params);
    } catch (e) {}
    if (!result) {
      continue;
    }
    results = Object.assign(results, result);
  }
  return results;
};
