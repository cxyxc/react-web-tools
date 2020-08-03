const defaultLanguage = 'zh-CN';

export function setLanguage(lang, rtl = false) {
    if(lang !== undefined && !/^([a-z]{2})-([A-Z]{2})$/.test(lang)) {
        // for reset when lang === undefined
        throw new Error('setLanguage lang format error');
    }
    window.localStorage.setItem('language', lang || '');
    if(rtl)
        window.localStorage.setItem('rtl', 1);
    else
        window.localStorage.setItem('rtl', 0);
    window.location.reload();
}

export function getLanguage() {
    return window.localStorage.getItem('language') || defaultLanguage;
}

export function getRtl() {
    return Boolean(Number(window.localStorage.getItem('rtl'))) || false;
}

export function getLocale() {
    return getLanguage().split('-')[0];
}
