'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getClass = require('@actualwave/get-class');
var closureValue = require('@actualwave/closure-value');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var getClass__default = /*#__PURE__*/_interopDefaultLegacy(getClass);

// Assigned to an object, when rendering, if exists, will wrap content, like
// Map{...} or Set[...]
const MAX_FUNC_STR_LEN = 30;
const setCustomClassNameTo = (data, className) => data.className = className;
const getCustomClassNameFrom = data => data.className || '';
const canPassAsIs = value => typeof value === 'string';
const validKeyRgx = /^[\w_$][\w\d_$]*$/i;
const keyNeedsConversion = key => !(canPassAsIs(key) && validKeyRgx.test(key));
const isNested = value => value && typeof value === 'object';
const setNestedWraps = (value, pre, post) => {
  value.pre = pre;
  value.post = post;
};
const getNestedWraps = ({
  pre,
  post
}) => ({
  pre,
  post
});
const setNestedShortContent = (value, short) => {
  value.short = short;
};
const getNestedShortContent = value => value.short;
const isList = target => isNested(target) && target.type === 'list';
const createList = () => ({
  type: 'list',
  values: [],
  pre: '[',
  post: ']'
});
const addToList = ({
  values
}, index, value) => values[index] = value;
const iterateList = ({
  values
}, handler) => values.forEach((value, index) => handler(value, index));
const getListSize = ({
  values
}) => values.length;
const isStorage = target => isNested(value) && target.type === 'storage';
const createStorage = () => ({
  type: 'storage',
  keys: [],
  values: [],
  pre: '{',
  post: '}'
});
const addToStorage = ({
  keys,
  values
}, key, value) => {
  keys.push(key);
  values.push(value);
};
const iterateStorage = (storage, handler) => {
  const {
    keys,
    values
  } = storage;
  keys.forEach((key, index) => handler(values[index], key));
};
const getStorageSize = ({
  keys
}) => keys.length;

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  MAX_FUNC_STR_LEN: MAX_FUNC_STR_LEN,
  setCustomClassNameTo: setCustomClassNameTo,
  getCustomClassNameFrom: getCustomClassNameFrom,
  canPassAsIs: canPassAsIs,
  keyNeedsConversion: keyNeedsConversion,
  isNested: isNested,
  setNestedWraps: setNestedWraps,
  getNestedWraps: getNestedWraps,
  setNestedShortContent: setNestedShortContent,
  getNestedShortContent: getNestedShortContent,
  isList: isList,
  createList: createList,
  addToList: addToList,
  iterateList: iterateList,
  getListSize: getListSize,
  isStorage: isStorage,
  createStorage: createStorage,
  addToStorage: addToStorage,
  iterateStorage: iterateStorage,
  getStorageSize: getStorageSize
});

var convertArray = ((value, convertValue) => {
  const result = createList();
  value.forEach((item, index) => {
    addToList(result, index, convertValue(item));
  });
  setCustomClassNameTo(result, getClass.getClassName(value));
  return result;
});

var convertBoolean = (value => `${value}`);

var convertDate = (value => `Date(${value})`);

var convertError = ((value, convertValue) => {
  const {
    name,
    message,
    columnNumber,
    fileName,
    lineNumber
  } = value;
  const result = createStorage();
  addToStorage(result, 'name', convertValue(name));
  addToStorage(result, 'message', convertValue(message));
  addToStorage(result, 'columnNumber', convertValue(columnNumber));
  addToStorage(result, 'fileName', convertValue(fileName));
  addToStorage(result, 'lineNumber', convertValue(lineNumber));
  setCustomClassNameTo(result, name || 'Error');
  return result;
});

var convertFunction = (value => {
  const content = String(value);

  if (content.length <= MAX_FUNC_STR_LEN) {
    return content;
  }

  const type = getClass.getClassName(value) || 'Function';
  let {
    name
  } = value;

  if (!name) {
    name = content.replace(/\s+/g, ' ').substr(content.substr(0, 9) === 'function ' ? 9 : 0, MAX_FUNC_STR_LEN);

    if (content.length < MAX_FUNC_STR_LEN) {
      name = `${name}...`;
    }
  }

  const result = createStorage();
  addToStorage(result, 'code', content);
  setNestedWraps(result, '(', ')');
  setNestedShortContent(result, name);
  setCustomClassNameTo(result, type);
  return result;
});

var convertMap = ((value, convertValue) => {
  const result = createStorage();
  value.forEach((item, key) => {
    /*
    Do not use keyNeedsConversion() here, because Map may hold values of
    different types as keys and string should be quoted, otherwise it may be
    unclear -- what you see string true or boolean true as key.
    */
    addToStorage(result, convertValue(key), convertValue(item));
  });
  setCustomClassNameTo(result, getClass.getClassName(value));
  return result;
});

var convertNumber = (value => `${value}`);

var convertObject = ((value, convertValue) => {
  const result = createStorage();
  Object.keys(value).forEach(key => {
    addToStorage(result, keyNeedsConversion(key) ? convertValue(key) : key, convertValue(value[key]));
  });
  setCustomClassNameTo(result, getClass.getClassName(value));
  return result;
});

var convertSet = ((value, convertValue) => {
  const result = createList(); // remove need in indexes for Set

  let index = 0;
  value.forEach(item => {
    addToList(result, index++, convertValue(item));
  });
  setCustomClassNameTo(result, getClass.getClassName(value));
  return result;
});

var convertString = (value => JSON.stringify(value));

var convertSymbol = (value => String(value));

// use Map to store handlers for every type in this case every
// handler could be replaced and customizable

const types = new Map();
/**
 * Type handler signature func(value:*, convertType:(value:*)): String|Array|Object;
 * @param {*} constructor
 * @param {*} handler
 */

const addTypeHandler = (constructor, handler) => {
  if (constructor && handler) {
    types.delete(constructor);
    types.set(constructor, handler);
  }
};
const hasTypeHandler = constructor => types.has(constructor);
const getTypeHandler = constructor => types.get(constructor);
const removeTypeHandler = constructor => types.delete(constructor);
const defaultTypeHandlerSelector = value => {
  const type = getClass__default['default'](value);
  return type && getTypeHandler(type);
};
let typeHandlerSelector = defaultTypeHandlerSelector;
/*
 * Used to get type handler instead of getTypeHandler(), can be customized.
 * @param {*} value
 */

const selectTypeHandler = value => typeHandlerSelector(value);
/**
 * Used to customize type selection algorythm, by default it just gets current
 * constructor value and looks for its handler.
 * @param {*} newSelector
 */

const setTypeHandlerSelector = newSelector => {
  typeHandlerSelector = newSelector;
};
addTypeHandler(Array, convertArray);
addTypeHandler(Boolean, convertBoolean);
addTypeHandler(Date, convertDate);
addTypeHandler(Error, convertError);
addTypeHandler(Function, convertFunction);
addTypeHandler(Map, convertMap);
addTypeHandler(Number, convertNumber);
addTypeHandler(Object, convertObject);
addTypeHandler(Set, convertSet);
addTypeHandler(String, convertString);
addTypeHandler(Symbol, convertSymbol);

const {
  get: getMaxNesingDepth,
  set: setMaxNesingDepth
} = closureValue.singleValueFactory(2);

const isString = value => {
  switch (typeof value) {
    case 'symbol':
    case 'string':
    case 'boolean':
    case 'number':
    case 'undefined':
      return true;

    default:
      return value === null || value instanceof Date;
  }
};
const toString = value => {
  switch (typeof value) {
    case 'symbol':
      return convertSymbol(value);

    case 'string':
      return convertString(value);

    case 'boolean':
      return convertBoolean(value);

    case 'number':
      return convertNumber(value);

    default:
      if (value instanceof Date) {
        return convertDate(value);
      }

      try {
        return `${value}`;
      } catch (error) {
        return '[object Non-Serializable]';
      }

  }
};

const fallbackConversion = (value, convertValue, refs) => {
  if (isString(value)) {
    return toString(value);
  }

  if (value instanceof Function) {
    return convertFunction(value);
  }

  if (value instanceof Error) {
    return convertError(value, convertValue);
  }

  if (value instanceof Map) {
    return convertMap(value, convertValue);
  }

  if (value instanceof Set) {
    return convertSet(value, convertValue);
  }

  if (value instanceof Array) {
    return convertArray(value, convertValue);
  }

  return convertObject(value, convertValue);
};

const convert = (value, level = 1, refs = new Map()) => {
  if (value === null || value === undefined) {
    return `${value}`;
  }

  const maxLevel = getMaxNesingDepth();

  if (level > maxLevel) {
    return toString(value);
  }

  const complex = !isString(value);

  if (complex && refs.has(value)) {
    return refs.get(value);
  }

  const handler = selectTypeHandler(value);

  const nextConvert = propValue => convert(propValue, level + 1, refs);

  let result;

  if (handler) {
    result = handler(value, nextConvert, refs);
  }

  result = fallbackConversion(value, nextConvert);

  if (complex) {
    refs.set(value, result);
  }

  return result;
};

exports.addTypeHandler = addTypeHandler;
exports.convert = convert;
exports.default = convert;
exports.getMaxNesingDepth = getMaxNesingDepth;
exports.getTypeHandler = getTypeHandler;
exports.hasTypeHandler = hasTypeHandler;
exports.isString = isString;
exports.removeTypeHandler = removeTypeHandler;
exports.setMaxNesingDepth = setMaxNesingDepth;
exports.setTypeHandlerSelector = setTypeHandlerSelector;
exports.toString = toString;
exports.utils = utils;
//# sourceMappingURL=index.js.map
