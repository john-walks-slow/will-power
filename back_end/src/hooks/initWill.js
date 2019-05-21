module.exports = function() {
  return context => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the message (and logger) to your needs
    Object.assign(context.data, { active: true });
    return context;
  };
};
