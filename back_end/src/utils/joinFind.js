module.exports = async function joinFind(services, query) {
  let results = {
    total: 0,
    limit: 0,
    skip: 0,
    data: []
  };
  for (let service of services) {
    let result = await service.find(query);
    results.data = [...results.data, ...result.data];
    results.total += result.total;
    results.limit += result.limit;
    results.skip += result.skip;
  }
  return results;
};
