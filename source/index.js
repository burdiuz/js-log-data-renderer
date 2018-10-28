import * as utils from './utils';

import {
  addTypeHandler,
  getTypeHandler,
  hasTypeHandler,
  removeTypeHandler,
  setTypeHandlerSelector,
} from './types';

import { isString, toString, convert } from './data';

import { getMaxNesingDepth, setMaxNesingDepth } from './max-depth';

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
