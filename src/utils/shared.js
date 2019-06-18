import locales from "../../config/i18n"

function getLocale(locale) {
    let lang = locale || 'en'
    return locales[lang]
}

function isHome(slug) {
    if (slug == '/' || slug == '/pl'){
        return true;
    }
    return false;
}

function getTranslation(tag, locale) {
    let translations = getLocale(locale);
    return translations[tag] ? translations[tag] : tag;
}

export { getLocale, isHome, getTranslation };