const fs = require('fs');
const path = require('path');
const template = require('lodash/template');
const yargs = require('yargs');
const chalk = require('chalk');
const {DEV} = require('./env');

const cwd = path.resolve(process.cwd());
const NODE_MODULES = path.join(cwd, 'node_modules');

const parseJson = file => JSON.parse(fs.readFileSync(file));

const isModule = name => {
    if(name.includes('./'))
        return false;
    return true;
};

const getModuleMainPath = moduleName => {
    const packageJson = parseJson(path.join(NODE_MODULES, moduleName, 'package.json')) || {};
    return path.join(NODE_MODULES, moduleName, packageJson.main);
};

module.exports = {
    cwd,
    NODE_MODULES,
    isModule,
    // 获取项目配置
    getConfig: configPath => {
        const config = require(path.join(cwd, configPath));
        // 默认配置
        const defaultConfig = require(path.join(__dirname, '../../conf/tools.default.conf.js'));

        return Object.freeze({
            compile: {
                ...defaultConfig.compile,
                ...config.compile
            },
            dev: {
                ...defaultConfig.dev,
                ...config.dev
            },
            mock: {
                ...defaultConfig.mock,
                ...config.mock
            },
            runtime: {
                ...defaultConfig.runtime,
                ...config.runtime
            }
        });
    },
    // 获取主题
    getTheme: () => {
        const THEME_FILE = path.join(cwd, './theme.js');
        const DEFAULT_THEME_FILE = path.resolve(__dirname, '../../conf/theme.default.js');

        let theme = {};
        if(fs.existsSync(THEME_FILE))
            theme = require(THEME_FILE);
        // 默认主题
        const defaultTheme = require(DEFAULT_THEME_FILE);

        return Object.freeze({
            ...defaultTheme,
            ...theme
        });
    },
    // 获取所有 client 信息
    resolveClients: (dependencies = []) => {
        // 将 dependencies 统一为数组形式处理
        if(typeof dependencies === 'string')
            dependencies = [
                dependencies
            ];
        // TODO: 之后彻底废弃 Object 的配置方式
        if(typeof dependencies === 'object' && !Array.isArray(dependencies)) {
            dependencies = Object.keys(dependencies);
            console.log(chalk.yellow(
                'tool.conf.js compile.dependencies will not support object type.please use array type instead.'
            ));
        }
        const pages = {};
        // 解析所有 Client
        dependencies.forEach(clientName => {
            let mainPath = '';
            if(isModule(clientName))
                mainPath = getModuleMainPath(clientName);
            else
                mainPath = path.join(cwd, clientName);
            const clientConfig = require(mainPath);
            // 解析所有 Page
            Object.keys(clientConfig.pages).forEach(pageName => {
                const page = clientConfig.pages[pageName];
                const key = pageName.replace(/\//g, '.');
                pages[key] = {
                    url: pageName,
                };
                if(page.path)
                    pages[key].path = isModule(clientName)
                        ? path.join(NODE_MODULES, clientName, `./lib/${page.path}`)
                        : path.join(cwd, clientName, page.path);
                else if(page.dependency)
                    pages[key].path = path.join(NODE_MODULES, page.dependency);
                else
                    console.log(chalk.red(`Not found path or dependency in ${pageName}`));
            });
        });
        return pages;
    },
    getTopMenus: (topMenusConfig = []) => {
        const topMenus = [];
        if(topMenusConfig)
            topMenusConfig.forEach(menus => {
                if(isModule(menus))
                    topMenus.push({
                        path: path.join(NODE_MODULES, menus).replace(/\\/g, '/')
                    });
                else
                    topMenus.push({
                        path: path.join(cwd, menus).replace(/\\/g, '/')
                    });
            });
        return topMenus;
    },
    // 生成入口文件
    generateEntry: (fileName, templatePath, options) => {
        const compiled = template(fs.readFileSync(path.resolve(__dirname, templatePath)));
        fs.writeFileSync(fileName, compiled(options));
    },
    // 调试工具
    debug: (debugMap = {}) => {
        const debugText = [];
        Object.keys(debugMap).forEach(key => {
            debugText.push(`// ${key}\n${JSON.stringify(debugMap[key])}`);
        });
        fs.writeFileSync(path.join(cwd, './tools.debug.log'), debugText.join('\n\n'));
    },
    // 获取命令行参数
    getCmdParams: env => {
        const argv = yargs
            .usage('Usage: web-tools <command> [options]')
            .example('web-tools start --config ./conf/tools.conf.js --webpack ./conf/webpack.dev.conf.js')
            .help()
            .describe('config', 'Tools config json file')
            .default('config', './conf/tools.conf.js')
            .describe('webpack', 'Webpack config file')
            .default('webpack',
                env === DEV ? './conf/webpack.dev.conf.js' : './conf/webpack.prod.conf.js')
            .argv;
        return argv;
    }
};
