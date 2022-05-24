import locales from '../../config/i18n';

function getLocale(locale) {
  let lang = locale || 'en';
  return locales[lang];
}

function isHome(slug) {
  return /^(\/*)(\d*)$/.test(slug);
}

function getTranslation(tag, locale) {
  let translations = getLocale(locale);
  return translations[tag] ? translations[tag] : tag;
}

export { getLocale, isHome, getTranslation };
