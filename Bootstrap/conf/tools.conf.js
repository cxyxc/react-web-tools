module.exports = {
    compile: {
        shell: '@shsdt/web-shell',
        bootstrapper: '../src',
        workingDir: './temp',
        dependencies: './example',
        api: './example/api',
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
                name: 'U.S. English',
                flag: 'us'
            }
        }
    },
    mock: {
        menus: [{
            title: '测试',
            pinyin: 'quanxian',
            initial: 'qx',
            items: [{
                title: '示例',
                pinyin: 'shili',
                initial: 'sqgl',
                icon: 'dashboard',
                items: [{
                    title: '示例一',
                    pinyin: 'shiliyi',
                    initial: 'sly',
                    url: '/#/page/page/'
                }]
            }]
        }],
        currentUserInfo: {
            id: '76b85e73-12a2-4295-8672-084c8af275a3',
            name: '经销商演示',
            username: 'page',
            enterpriseName: '测试经销商0001',
            roles: ['全能']
        }
    }
};
