module.exports = async function(
  userId,
  {
    field,
    delta = 0,
    min = 0,
    max = null,
    stayOriginal = false,
    nullIfStay = true,
    usePrivate = true,
    notify = false
  }
) {
  let original = await this.get(userId);
  let originalField = original[field];
  let result = {};

  if (min && originalField + delta < min) {
    result[field] = stayOriginal ? (nullIfStay ? null : original[field]) : min;
  } else if (max && originalField + delta > max) {
    result[field] = stayOriginal ? (nullIfStay ? null : original[field]) : max;
  } else {
    result[field] = originalField + delta;
  }
  if (usePrivate) {
    result = await this._patch(userId, result, {});
  } else {
    result = await this.patch(userId, result, {});
  }
  if (notify) {
    this.emit('patched', result);
  }
  return result;
};
