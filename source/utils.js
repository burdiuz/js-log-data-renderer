// Assigned to an object, when rendering, if exists, will wrap content, like
// Map{...} or Set[...]
export const CLASS_NAME_KEY = '@class-name';

export const SPACE_LEVEL = '  ';
export const MAX_FUNC_STR_LEN = 30;

export const setCustomClassNameTo = (data, className) =>
  (data[CLASS_NAME_KEY] = className);

export const getCustomClassNameFrom = (data) => data[CLASS_NAME_KEY] || '';

export const getStringWrap = (value) => {
  let pre;
  let post;
  const name = getCustomClassNameFrom(value);

  if (value instanceof Array) {
    pre = '[';
    post = ']';
  } else {
    pre = '{';
    post = '}';
  }

  pre = `${name}${pre}`;

  return { pre, post };
};

export const canPassAsIs = (value) => typeof value === 'string';

const validKeyRgx = /^[\w_$][\w\d_$]*$/i;

export const keyNeedsConversion = (key) => !(canPassAsIs(key) && validKeyRgx.test(key));

export const isNested = (value) => typeof value === 'object';

export const createComplexDataStorage = () => new Map();

export const isStorage = (storage) => storage instanceof Map;

export const addToStorage = (storage, key, value) => storage.set(key, value);

export const iterateStorage = (storage, handler) => storage.forEach(handler);

export const getStorageSize = (storage) => storage.size;