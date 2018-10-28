// Assigned to an object, when rendering, if exists, will wrap content, like
// Map{...} or Set[...]
export const CLASS_NAME_KEY = 'className';
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

export const keyNeedsConversion = (key) =>
  !(canPassAsIs(key) && validKeyRgx.test(key));

export const isNested = (value) => value && typeof value === 'object';

export const isList = (target) => isNested(target) && target.type === 'list';

export const createList = () => ({ type: 'list', values: [] });

export const addToList = ({ values }, index, value) => (values[index] = value);

export const iterateList = ({ values }, handler) =>
  values.forEach((value, index) => handler(value, index));

export const getListSize = ({ values }) => values.length;

export const isStorage = (target) =>
  isNested(value) && target.type === 'storage';

export const createStorage = () => ({ type: 'storage', keys: [], values: [] });

export const addToStorage = ({ keys, values }, key, value) => {
  keys.push(key);
  values.push(value);
};

export const iterateStorage = (storage, handler) => {
  const { keys, values } = storage;

  keys.forEach((key, index) => handler(values[index], key));
};

export const getStorageSize = ({ keys }) => keys.length;
