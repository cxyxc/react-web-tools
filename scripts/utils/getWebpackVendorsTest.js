/**
 * 用于 webpack 配置 vendors 模块拆分
 *
 * 说明：
 * 由于 web-main 将业务代码作为依赖安装（即和第三方库一样均安装在 node_moduels 目录下）
 * 此处根据用户配置，区分出第三方依赖/Shell/Shared/业务代码
 */

const {isModule} = require('./tools');

const dependenciesNameList = [
    'shell',
    'bootstrapper',
    'topMenus',
    'dependencies',
];

const defaultDependenciesPathList = [
    '@shsdt'
];

module.exports = function getWebpackVendorsTest(config) {
    const dependenciesPathList = [
        ...defaultDependenciesPathList
    ];
    Object.getOwnPropertyNames(config).forEach(name => {
        if(dependenciesNameList.includes(name))
            if(Array.isArray(config[name]))
                config[name].forEach(filepath => {
                    if(isModule(filepath) && defaultDependenciesPathList.every(
                        item => !filepath.includes(item)
                    ))
                        dependenciesPathList.push(filepath);
                });
            else
                dependenciesPathList.push(config[name]);
    });
    return function(module) {
        if(!module.context) return false;
        const modulePath = module.context.replace(/\\/g, '/');
        if(/node_modules/.test(modulePath))
            return dependenciesPathList.every(item => !modulePath.includes(item));
        return false;
    };
};
