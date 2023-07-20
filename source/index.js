import * as utils from './utils.js';

import {
  addTypeHandler,
  getTypeHandler,
  hasTypeHandler,
  removeTypeHandler,
  setTypeHandlerSelector,
} from './types/index.js';

import { isString, toString, convert } from './data.js';

import { getMaxNesingDepth, setMaxNesingDepth } from './max-depth.js';

export default convert;

export {
  utils,
  addTypeHandler,
  getTypeHandler,
  hasTypeHandler,
  removeTypeHandler,
  setTypeHandlerSelector,
  isString,
  toString,
  convert,
  getMaxNesingDepth,
  setMaxNesingDepth,
};
