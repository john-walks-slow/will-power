module.exports = function() {
  return context => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    for (let field in context.params.query) {
      if (context.params.query[field] === 'true') {
        context.params.query[field] = true;
      }
      if (context.params.query[field] === 'false') {
        context.params.query[field] = false;
      }
    }
    return context;
  };
};
