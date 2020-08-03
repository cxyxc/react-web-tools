const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const {
    DEV
} = require('./utils/env');
const tools = require('./utils/tools');
const generateTempFiles = require('./utils/generateTempFiles');
const WebpackDevServer = require('webpack-dev-server');
const getWebpackVendorsTest = require('./utils/getWebpackVendorsTest');
const getBeforeReactDOM = require('./utils/getBeforeReactDOM');

const NODE_MODULES = path.join(process.cwd(), 'node_modules');
// 多项目 mock 服务合并
const combineApi = dependencies => {
    const apis = [];
    dependencies.forEach(clientName => {
        const apiPath = path.join(NODE_MODULES, clientName, './src/api');
        if(fs.existsSync(apiPath))
            apis.push(require(apiPath));
    });
    const rootApi = app => {
        apis.forEach(api => api(app));
    };
    return rootApi;
};

try {
    const {
        config: configPath,
        webpack: webpackConfigPath
    } = tools.getCmdParams(DEV);
    const {
        compile: compileConfig,
        dev: devConfig,
        mock: mockConfig,
        runtime: runtimeConfig
    } = tools.getConfig(configPath);

    // 解析 pages 生成临时文件
    generateTempFiles({
        compileConfig,
        devConfig,
        mockConfig,
        runtimeConfig,
        env: DEV
    });

    const cwd = tools.cwd;

    // 添加 webpack 配置
    const options = {
        title: runtimeConfig.title,
        entry: {
            index: [
                require.resolve('@babel/polyfill'),
                compileConfig.workingDir
            ]
        },
        theme: tools.getTheme(),
        vendorsTest: getWebpackVendorsTest(compileConfig),
        beforeReactDOM: compileConfig.beforeReactDOM ? getBeforeReactDOM(compileConfig.beforeReactDOM) : ''
    };
    const webpackDefaultConfig = require('../conf/webpack.dev.conf')(options);
    
    // 合并 webpack 配置
    let webpackConfig = webpackDefaultConfig;
    if(fs.existsSync(path.join(cwd, webpackConfigPath)))
        webpackConfig = merge.smart(
            webpackDefaultConfig,
            require(path.join(cwd, webpackConfigPath))
        );

    const setupApi = typeof compileConfig.dependencies === 'string'
        ? require(path.join(cwd, compileConfig.api))
        : combineApi(compileConfig.dependencies);
    const setupShellApi = require(path.resolve(cwd,
        compileConfig.shellApi ||
        `node_modules/${compileConfig.shell}/lib/api`)).default;

    const url = `http://${devConfig.host}:${devConfig.port}`;
    const serverOptions = {
        hot: true,
        staticOptions: {
            maxAge: '1d'
        },
        stats: {
            colors: true,
            hash: false
        },
        before: app => {
            setupApi(app);
            setupShellApi(app, mockConfig);
        },
        publicPath: url,
        contentBase: [
            path.join(cwd, './static'),
            path.join(cwd, 'node_modules', compileConfig.shell, './static')
        ]
    };

    const devServer = new WebpackDevServer(webpack(webpackConfig), serverOptions);

    // 配置信息文件日志 调试用
    if(compileConfig.debug === true)
        tools.debug({
            webpackConfig,
            devServerConfig: serverOptions
        });

    devServer.listen(devConfig.port, devConfig.host, () => {
        console.log(chalk.green(`Server started on http://${devConfig.host}:${devConfig.port}, Please wait while webpack compiling modules...`));
    });
} catch(ex) {
    console.log(chalk.red(ex));
    process.exit(1);
}
