import { getClassName } from '@actualwave/get-class';

import {
  setCustomClassNameTo,
  createStorage,
  addToStorage,
  keyNeedsConversion,
} from '../utils.js';

export default (value, convertValue) => {
  const result = createStorage();

  Object.keys(value).forEach((key) => {
    try {
      addToStorage(
        result,
        keyNeedsConversion(key) ? convertValue(key) : key,
        convertValue(value[key]),
      );
    } catch (error) {
      /* Possible SecurityError when accessing properties from restricted origin */
    }
  });

  setCustomClassNameTo(result, getClassName(value));

  return result;
};
