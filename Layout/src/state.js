const storage = window.localStorage;

export default config => ({
    ui: {
        language: ([storage.getItem('language'),
            window.navigator.userLanguage, window.navigator.language])
            .find(item => item && config.languages[item]) || config.defaultLanguage,
        // 目前根据缓存设置 isSidebarExpanded 的逻辑已经移动到 epic.js
        isSidebarExpanded: true,
        menuSystemPosition: config.menuSystemPosition === 'fix' ? '' : ([storage.getItem('menuSystemPosition'), config.menuSystemPosition]).find(item => ['none', 'top', 'bottom'].includes(item)),
        isBusy: false,
        actions: [],
        breadcrumb: [],
        menus: [],
        // 当前 menu
        currentMenu: null,
        // 最近访问
        recents: (storage.hasOwnProperty('recents') && JSON.parse(storage.getItem('recents'))) || [],
        copyright: config.copyright,
        languages: config.languages,
        basePath: config.basePath,
        menuMinSearchLevel: config.menuMinSearchLevel || 0
    }
});
