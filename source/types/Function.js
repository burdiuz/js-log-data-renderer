import { getClassName } from '@actualwave/get-class';

import {
  MAX_FUNC_STR_LEN,
  setCustomClassNameTo,
  createStorage,
  addToStorage,
  setNestedWraps,
  setNestedShortContent,
} from '../utils';

export default (value) => {
  const content = String(value);

  if (content.length <= MAX_FUNC_STR_LEN) {
    return content;
  }

  const type = getClassName(value) || 'Function';

  let { name } = value;

  if (!name) {
    name = content
      .replace(/\s+/g, ' ')
      .substr(content.substr(0, 9) === 'function ' ? 9 : 0, MAX_FUNC_STR_LEN);

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
};
