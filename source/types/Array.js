import { getClassName } from '@actualwave/get-class';

import { setCustomClassNameTo, createList, addToList } from '../utils.js';

export default (value, convertValue) => {
  const result = createList();

  value.forEach((item, index) => {
    addToList(result, index, convertValue(item));
  });

  setCustomClassNameTo(result, getClassName(value));

  return result;
};
