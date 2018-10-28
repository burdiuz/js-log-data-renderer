import { getClassName } from '@actualwave/get-class';

import {
  setCustomClassNameTo,
  createStorage,
  addToStorage,
  keyNeedsConversion,
} from '../utils';

export default (value, convertValue) => {
  const result = createStorage();

  Object.keys(value).forEach((key) => {
    addToStorage(
      result,
      keyNeedsConversion(key) ? convertValue(key) : key,
      convertValue(value[key]),
    );
  });

  setCustomClassNameTo(result, getClassName(value));

  return result;
};
