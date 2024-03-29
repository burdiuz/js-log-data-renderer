import { getClassName } from '@actualwave/get-class';

import {
  setCustomClassNameTo,
  createStorage,
  addToStorage,
} from '../utils.js';

export default (value, convertValue) => {
  const result = createStorage();

  value.forEach((item, key) => {
    /*
    Do not use keyNeedsConversion() here, because Map may hold values of
    different types as keys and string should be quoted, otherwise it may be
    unclear -- what you see string true or boolean true as key.
    */
    addToStorage(result, convertValue(key), convertValue(item));
  });

  setCustomClassNameTo(result, getClassName(value));

  return result;
};
