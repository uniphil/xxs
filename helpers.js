'use strict';

const a = {
  setAt(arr, i, v) {
    const copy = arr.slice();
    copy[i] = v;
    return copy;
  },
};

const o = {
  update(obj, toMerge) {
    return Object.assign({}, obj, toMerge);
  },
  set(obj, key, val) {
    return o.update(obj, { [key]: val });
  },
};
