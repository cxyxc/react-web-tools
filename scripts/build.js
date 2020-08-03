const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const {PROD} = require('./utils/env');
const tools = require('./utils/tools');
const generateTempFiles = require('./utils/generateTempFiles');
const getWebpackVendorsTest = require('./utils/getWebpackVendorsTest');
const getBeforeReactDOM = require('./utils/getBeforeReactDOM');

try {
    const {config: configPath, webpack: webpackConfigPath} = tools.getCmdParams(PROD);
    const {
        compile: compileConfig,
        runtime: runtimeConfig
    } = tools.getConfig(configPath);
    
    // 解析 pages 生成临时文件
    generateTempFiles({
        compileConfig,
        runtimeConfig,
        env: PROD
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
    const webpackDefaultConfig = require('../conf/webpack.prod.conf')(options);
    
    // 合并 webpack 配置
    let webpackConfig = webpackDefaultConfig;
    if(fs.existsSync(path.join(cwd, webpackConfigPath)))
        webpackConfig = merge.smart(
            webpackDefaultConfig,
            require(path.join(cwd, webpackConfigPath))
        );

    // 配置信息文件日志 调试用
    if(compileConfig.debug === true)
        tools.debug({webpackConfig});

    // Webpack

    // 删除 release 目录
    fs.removeSync(path.join(cwd, './release'));

    webpack(webpackConfig, (err, stats) => {
        if(err) {
            console.log(chalk.red(err.details || err));
            process.exit(1);
        }

        const info = stats.toJson('verbose');
     
        if(stats.hasWarnings())
            console.log(chalk.yellow(info.warnings.join('\n')));
        if(stats.hasErrors()) {
            console.log(chalk.red(info.errors.join('\n')));
            process.exit(1);
        }
     
        console.log(chalk.green(' - publicPath:'), info.publicPath);
        Object.keys(info.entrypoints).forEach(entry => console.log(chalk.green(' - entrypoint:'), entry, '->',
            info.entrypoints[entry].assets.filter(f => f.endsWith('.js')).join(', ')));
        
        // 删除临时文件夹
        fs.removeSync(path.join(cwd, compileConfig.workingDir));
    });
} catch(ex) {
    console.log(chalk.red(ex));
    process.exit(1);
}
