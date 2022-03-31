import { getTranslation } from '../utils/shared';

function getTagTranslation(tag, locale, index, length) {
  return getTranslation(tag, locale) + (index < length - 1 ? ', ' : '');
}

export default getTagTranslation;
