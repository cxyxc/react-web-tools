const fs = require('fs-extra');
const path = require('path');
const tools = require('./tools');

const generateTempFiles = ({
    compileConfig = {},
    runtimeConfig = {},
    mockConfig = {},
    env
}) => {
    // 解析 Client 获取所有 Page
    const pages = tools.resolveClients(compileConfig.dependencies);

    // 根据 compileConfig.homePage 添加主页
    if(compileConfig.homePage)
        if(tools.isModule(compileConfig.homePage))
            pages.home = {
                path: path.join(tools.NODE_MODULES, compileConfig.homePage)
            };
        else
            pages.home = {
                path: path.join(tools.cwd, compileConfig.homePage)
            };
    
    // 根据 Page 生成临时文件
    if(!fs.existsSync(compileConfig.workingDir))
        fs.mkdirSync(compileConfig.workingDir);
    
    const pageKeys = Object.keys(pages);
    const componentModules = [];
    const replaceSep = s => s.replace(/\\/g, '/');
    pageKeys.forEach(chunk => {
        const fileName = path.resolve(path.join(compileConfig.workingDir, `${chunk}.js`));
        const name = chunk.replace(/\./g, '/');
        componentModules.push({
            name,
            path: replaceSep(fileName)
        });
        // 生成各节点异步组件入口
        tools.generateEntry(fileName, '../../template/entryfile.component.tpl', {
            bootstrapper: compileConfig.bootstrapper,
            name: chunk.replace(/\./g, '/'),
            runtimeConfig: JSON.stringify(runtimeConfig) || '{}',
            globalConfig: JSON.stringify(mockConfig.global) || '{}',
            page: replaceSep(pages[chunk].path)
        });
    });

    // 生成入口文件
    tools.generateEntry(`${compileConfig.workingDir}/index.js`,
        '../../template/entryfile.index.tpl', {
            env,
            importBootstrapper: `import {${env} as Bootstrapper} from '${compileConfig.bootstrapper}';`,
            shell: compileConfig.shell,
            runtimeConfig: JSON.stringify(runtimeConfig) || '{}',
            globalConfig: JSON.stringify(mockConfig.global) || '{}',
            componentModules,
            topMenus: tools.getTopMenus(compileConfig.topMenus)
        });
};

module.exports = generateTempFiles;
