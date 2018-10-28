'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var getClass = require('@actualwave/get-class');
var getClass__default = _interopDefault(getClass);
var closureValue = require('@actualwave/closure-value');

// Assigned to an object, when rendering, if exists, will wrap content, like
// Map{...} or Set[...]
const CLASS_NAME_KEY = '@class-name';
const SPACE_LEVEL = '  ';
const MAX_FUNC_STR_LEN = 30;
const setCustomClassNameTo = (data, className) => data[CLASS_NAME_KEY] = className;
const getCustomClassNameFrom = data => data[CLASS_NAME_KEY] || '';
const getStringWrap = value => {
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
  return {
    pre,
    post
  };
};
const canPassAsIs = value => typeof value === 'string';
const validKeyRgx = /^[\w_$][\w\d_$]*$/i;
const keyNeedsConversion = key => !(canPassAsIs(key) && validKeyRgx.test(key));
const isNested = value => typeof value === 'object';
const createComplexDataStorage = () => new Map();
const isStorage = storage => storage instanceof Map;
const addToStorage = (storage, key, value) => storage.set(key, value);
const iterateStorage = (storage, handler) => storage.forEach(handler);
const getStorageSize = storage => storage.size;

var utils = /*#__PURE__*/Object.freeze({
  CLASS_NAME_KEY: CLASS_NAME_KEY,
  SPACE_LEVEL: SPACE_LEVEL,
  MAX_FUNC_STR_LEN: MAX_FUNC_STR_LEN,
  setCustomClassNameTo: setCustomClassNameTo,
  getCustomClassNameFrom: getCustomClassNameFrom,
  getStringWrap: getStringWrap,
  canPassAsIs: canPassAsIs,
  keyNeedsConversion: keyNeedsConversion,
  isNested: isNested,
  createComplexDataStorage: createComplexDataStorage,
  isStorage: isStorage,
  addToStorage: addToStorage,
  iterateStorage: iterateStorage,
  getStorageSize: getStorageSize
});

var convertArray = ((value, convertValue) => {
  const result = value.map(convertValue);
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
  const result = createComplexDataStorage();
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
    name = content.substr(content.substr(0, 9) === 'function ' ? 9 : 0, MAX_FUNC_STR_LEN);
  }

  const result = createComplexDataStorage();
  addToStorage(result, 'content', content);
  setCustomClassNameTo(result, // FIXME almost every function starts with "function ", remove this from short string
  `${type}(${name})`);
  return result;
});

var convertMap = ((value, convertValue) => {
  const result = createComplexDataStorage();
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
  const result = createComplexDataStorage();
  Object.keys(value).forEach(key => {
    addToStorage(result, keyNeedsConversion(key) ? convertValue(key) : key, convertValue(value[key]));
  });
  setCustomClassNameTo(result, getClass.getClassName(value));
  return result;
});

var convertSet = ((value, convertValue) => {
  const result = [];
  value.forEach(item => result.push(convertValue(item)));
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
  const type = getClass__default(value);
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

      return `${value}`;
  }
};

const fallbackConversion = (value, convertValue, refs) => {
  if (isString(value)) {
    return toString(value);
  }

  if (value instanceof Function) {
    return convertFunction(value, convertValue, refs);
  }

  if (value instanceof Error) {
    return convertError(value, convertValue, refs);
  }

  if (value instanceof Map) {
    return convertMap(value, convertValue, refs);
  }

  if (value instanceof Set) {
    return convertSet(value, convertValue, refs);
  }

  if (value instanceof Array) {
    return convertArray(value, convertValue, refs);
  }

  return convertObject(value, convertValue, refs);
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

  result = fallbackConversion(value, nextConvert, refs);

  if (complex) {
    refs.set(value, result);
  }

  return result;
};

exports.default = convert;
exports.utils = utils;
exports.addTypeHandler = addTypeHandler;
exports.getTypeHandler = getTypeHandler;
exports.hasTypeHandler = hasTypeHandler;
exports.removeTypeHandler = removeTypeHandler;
exports.setTypeHandlerSelector = setTypeHandlerSelector;
exports.isString = isString;
exports.toString = toString;
exports.convert = convert;
exports.getMaxNesingDepth = getMaxNesingDepth;
exports.setMaxNesingDepth = setMaxNesingDepth;
//# sourceMappingURL=index.js.map