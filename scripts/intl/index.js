const babel = require('@babel/core');
const path = require('path');
const fs = require('file-system');
const yargs = require('yargs');
const Manager = require('./manager');
const jsonfile = require('jsonfile');
const diff = require('deep-diff').diff;
const $assert = require('assert');

const argv = yargs
    .example('web-tools intl --work-dir ./src/client')
    .help()
    .describe('work-dir', 'work dir')
    .default('work-dir', './src/client')
    .describe('diff', 'show localizations diff')
    .default('diff', false)
    .describe('continue', 'continue when error')
    .default('continue', false)
    .describe('test', 'test intl is ok, no localizations')
    .default('test', false)
    .argv;

// 解析 web-client index.js 获取到所有节点名
const pageDirs = [];
const pageConfig = require(path.join(process.cwd(), argv.workDir, 'index.js'));
if(pageConfig && pageConfig.pages)
    Object.values(pageConfig.pages).forEach(item => {
        if(item.path)
            pageDirs.push(item.path);
    });

// 获取回车符在代码中的位置，用于计算行号
function getEnterPlace(string) {
    const enterArray = [];
    for(let i = 0; i < string.length; i++)
        if(string[i] === '\n')
            enterArray.push(i);
    
    return enterArray;
}

// 计算行号
function getLine(enterArray, start) {
    let line = 0;
    enterArray.forEach((item, index) => {
        if(start <= item && line === 0)
            line = index + 1;
    });
    return line;
}

// 核心 babel 逻辑
function run(filepath, manager) {
    const file = fs.readFileSync(filepath).toString();
    
    const assert = (expect, message, lineStart) => {
        const errorPath = `${filepath}:${getLine(getEnterPlace(file), lineStart)}`;
        // 当前处于 contine 模式，打印提示信息，不报错
        if(argv.continue && !expect) {
            console.error(`${message}\n\n${errorPath}\n`);
            return;
        }
        $assert(expect, `${message}\n\n${errorPath}\n`);
    };

    babel.transformFileSync(filepath, {
        babelrc: false,
        plugins: [
            require.resolve('@babel/plugin-syntax-object-rest-spread'),
            require.resolve('@babel/plugin-syntax-class-properties'),
            require.resolve('@babel/plugin-syntax-jsx'),
            babel.createConfigItem(require('./plugin')(
                manager,
                assert
            ))
        ]
    });
}

// 创建语言包（暂时仅处理中文）
function generateLocalizations(dir, localization) {
    // 发现正处于 test 模式，跳过语言包创建
    if(argv.test) return;

    const localizationsDir = path.join(dir, './localizations');
    if(!fs.existsSync(localizationsDir))
        fs.mkdirSync(localizationsDir);
    const CNPath = path.join(localizationsDir, './zh-CN.json');

    // 发现已有语言包，且开启 diff 功能
    if(fs.existsSync(CNPath) && argv.diff) {
        const diffLog = diff(jsonfile.readFileSync(CNPath), localization) || {};
        console.dir(diffLog);
        jsonfile.writeFileSync(path.join(localizationsDir, './diff.log'), diffLog, {spaces: 4,
            EOL: '\r\n'});
        return;
    }
    
    jsonfile.writeFileSync(CNPath, localization, {spaces: 4,
        EOL: '\r\n'});
}

// 处理节点
pageDirs.forEach(pageDir => {
    // 创建 manager
    const manager = new Manager();
    // 遍历当前节点文件
    const workDir = path.join(argv.workDir, pageDir);
    fs.recurseSync(workDir, [
        '**/*.js',
        '**/*.jsx',
    ], (filepath, relative, filename) => {
        if(!filename) return;
        run(filepath, manager);
    });
    generateLocalizations(workDir, manager.getLocalization());
});

// 处理公共部分
const manager = new Manager();
fs.recurseSync(argv.workDir, [
    '*.js',
    '*.jsx',
    'common/**/*.js',
    'common/**/*.jsx'
], (filepath, relative, filename) => {
    if(!filename) return;
    // 核心 babel 逻辑
    run(filepath, manager);
    // 创建语言包
    generateLocalizations(path.join(argv.workDir, './common'), manager.getLocalization());
});
