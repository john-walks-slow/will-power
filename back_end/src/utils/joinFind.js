module.exports = async function joinFind(services, params) {
  let results = {
    total: 0,
    limit: 0,
    skip: 0,
    data: []
  };
  for (let service of services) {
    try {
      var result = await service.find(params);
    } catch (e) {
      console.log(e);
    }
    results.data = [...results.data, ...result.data];
    results.total += result.total;
    results.limit += result.limit;
    results.skip += result.skip;
  }
  return results;
};
