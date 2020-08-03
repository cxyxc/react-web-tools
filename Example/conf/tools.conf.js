module.exports = {
    compile: {
        shell: '@shsdt/web-shell',
        bootstrapper: '@shsdt/web-bootstrap',
        workingDir: './temp',
        topMenus: [
            '@shsdt/top-menu/lib/TopMenu/Notification',
            '@shsdt/top-menu/lib/TopMenu/UserInfo'
        ],
        dependencies: './src/client',
        api: './src/api'
    },
    dev: {
        contentBase: ['./static'],
        host: 'localhost',
        port: 3000
    },
    runtime: {
        title: '晨阑DMS管理系统',
        copyright: '2016-2017 © Shanghai Sunlight Data Technology Co., Ltd. All rights reserved.',
        defaultLanguage: 'zh-CN',
        languages: {
            'zh-CN': {
                name: '简体中文',
                flag: 'cn'
            },
            'en-US': {
                name: 'English',
                flag: 'us'
            }
        }
    },
    mock: {
        menus: []
    }
};
