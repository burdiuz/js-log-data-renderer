// Assigned to an object, when rendering, if exists, will wrap content, like
// Map{...} or Set[...]
export const MAX_FUNC_STR_LEN = 30;

export const setCustomClassNameTo = (data, className) =>
  (data.className = className);

export const getCustomClassNameFrom = (data) => data.className || '';

export const canPassAsIs = (value) => typeof value === 'string';

const validKeyRgx = /^[\w_$][\w\d_$]*$/i;

export const keyNeedsConversion = (key) =>
  !(canPassAsIs(key) && validKeyRgx.test(key));

export const isNested = (value) => value && typeof value === 'object';

export const setNestedWraps = (value, pre, post) => {
  value.pre = pre;
  value.post = post;
};

export const getNestedWraps = ({ pre, post }) => ({ pre, post });

export const setNestedShortContent = (value, short) => {
  value.short = short;
};

export const getNestedShortContent = (value) => value.short;

export const isList = (target) => isNested(target) && target.type === 'list';

export const createList = () => ({
  type: 'list',
  values: [],
  pre: '[',
  post: ']',
});

export const addToList = ({ values }, index, value) => (values[index] = value);

export const iterateList = ({ values }, handler) =>
  values.forEach((value, index) => handler(value, index));

export const getListSize = ({ values }) => values.length;

export const isStorage = (target) =>
  isNested(value) && target.type === 'storage';

export const createStorage = () => ({
  type: 'storage',
  keys: [],
  values: [],
  pre: '{',
  post: '}',
});

export const addToStorage = ({ keys, values }, key, value) => {
  keys.push(key);
  values.push(value);
};

export const iterateStorage = (storage, handler) => {
  const { keys, values } = storage;

  keys.forEach((key, index) => handler(values[index], key));
};

export const getStorageSize = ({ keys }) => keys.length;
