module.exports = async function(
  id,
  {
    field,
    delta = 0,
    min = null,
    max = null,
    stayOriginal = false,
    nullIfStay = true,
    usePrivate = false,
    notify = false
  }
) {
  let original = await this.get(id);
  let originalField = original[field];
  let result = {};

  if (min && originalField + delta < min) {
    result[field] = stayOriginal ? originalField : min;
  } else if (max && originalField + delta > max) {
    result[field] = stayOriginal ? originalField : max;
  } else {
    result[field] = originalField + delta;
  }
  if (usePrivate) {
    result = await this._patch(id, result, {});
  } else {
    result = await this.patch(id, result, {});
  }
  if (notify) {
    this.emit('patched', result);
  }
  if (nullIfStay && result[field] == originalField) {
    return null;
  }
  return result;
};
