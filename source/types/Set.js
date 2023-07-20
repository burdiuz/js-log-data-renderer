import { getClassName } from '@actualwave/get-class';

import { setCustomClassNameTo, createList, addToList } from '../utils.js';

export default (value, convertValue) => {
  const result = createList();
  // remove need in indexes for Set
  let index = 0;

  value.forEach((item) => {
    addToList(result, index++, convertValue(item));
  });

  setCustomClassNameTo(result, getClassName(value));

  return result;
};
