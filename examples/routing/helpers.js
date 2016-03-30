export const o = {
  update(obj, toMerge) {
    return Object.assign({}, obj, toMerge);
  },
  set(obj, key, val) {
    return o.update(obj, { [key]: val });
  },
};
