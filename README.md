# 简介
    本项目为基于 webpack 的 Web 前端项目开发、编译工具

# 安装
```shell
# 使用 npm 安装
npm i git+https://github.com/cxyxc/react-web-tools.git --save-dev

# 使用 yarn 安装
yarn add git+https://github.com/cxyxc/react-web-tools.git -D
```


# CLI 用法
```shell
# 开启开发服务器运行项目
# Options:
#  --config   tools 工具配置文件路径            [default: "./conf/tools.conf.js"]
#  --webpack  webpack 配置文件路径        [default: "./conf/webpack.dev.conf.js"]
web-tools start [options]

# 编译发布文件至 release 目录
# Options:
#  --config   tools 工具配置文件路径            [default: "./conf/tools.conf.js"]
#  --webpack  webpack 配置文件路径       [default: "./conf/webpack.prod.conf.js"]
web-tools build [options]
```

# 配置详解
## tools.conf.js 配置
```javascript
module.exports = {
    // 运行所需配置
    compile: {
        // 程序外壳地址
        shell: '...',
        // 启动器地址
        bootstrapper: '...',
        // 首页节点配置 支持 npm 包路径及相对路径 eg. ./home
        homePage: undefined,
        // topMenu 支持 npm 包路径及相对路径 eg. ['@shsdt/top-menu/lib/TopMenu/Language']
        // 相对路径相对于项目根目录
        topMenus: []
        // 临时目录，用于存放动态生成的 webpack 入口文件
        workingDir: './temp',
        // 项目 Client 入口
        // 支持 string 和 array[string]
        //   string 表示单个 Client 入口路径，一般用于开发环境下，eg. './src/client'
        //   array 表示 Client 列表，一般用于多项目合并打包，eg. ['@shsdt/am-web-client']
        dependencies: './src/client',
        // 调试开关，开启后会输出 tools.debug.log 文件到项目根目录
        debug: false
    },
    // 运行时注入代码的变量
    // note：web-tools 运行时，该配置对所有 compile.dependencies 有效
    //       1. web-client publish 生成 npm 包，仅做 babel 编译，不包含其 tools.conf.js 内容
    //       2. web-main 引用 web-client npm 包，使用自身 tools.conf.js，生成最终产出物
    runtime: {
        // 项目 title
        title: '...',
        // 版权信息
        copyright: '...',
        // 默认语言配置
        defaultLanguage: 'zh-CN',
        // 多语言配置
        languages: {
            'zh-CN': {
                name: '简体中文',
                flag: 'cn'
            },
            'en-US': {
                name: 'English'
                flag: 'us'
            }
        },
        // 系统功能菜单位置
        // 无参数，默认在顶部，不可调整
        // none 隐藏，top 初始在顶部，bottom 初始在底部
        // fix 忽略 localstorage 参数，始终保持在顶部
        menuSystemPosition: ''
    },
    // 开发环境配置 
    dev: {
        host: 'localhost',
        port: 3000,
        hot: true
    },
    // 开发环境配置 
    // 运行时注入 mock server 代码的变量
    mock: {
        // 侧边菜单数据
        // Shell api mock: GET /api/v1/users/me/pages
        menu: [{
            title: 'xxx',
            pinyin: 'xxx',
            initial: 'xxx',
            items: [{
                title: 'xxx',
                pinyin: 'xxx',
                initial: 'xxx',
                url: '/xxx/xxx/'
            }]
        }],
        // 用户信息数据
        // Shell api mock: GET /api/v1/users/me
        currentUserInfo: {
            id: '1',
            name: 'XX',
            username: 'XXX',
            enterpriseName: 'xxx',
            roles: ['xxx']
        },
        // 全局配置信息
        // Bootstrap static file mock: config.json
        global: {
            loginUrl: '/login',
            logoutUrl: '/loginout',
            resetPasswordUrl: '/reset-password',
        }
    }
};
```

## webpack 配置
* 本项目使用了 [webpack-merge](https://www.npmjs.com/package/webpack-merge) 库的 merge.smart() 方法，合并 web-tools 预置配置、项目自定义配置，做为最终的 webpack 配置
* 合并后的配置可通过开启 compile.debug，在 tools.debug.log 文件中查看
* 项目自定义配置优先高，但非必需，可根据需求添加

```javascript
// webpack.prod.conf.js

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // eg：编译产出物，输出目录 release -> output
    //     覆盖 web-tools 预置配置
    output: {
        path: path.resolve('./output')
    },
    // eg：使用 copy-webpack-plugin 用于文件拷贝
    //     增加新配置
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'xxx',
                to: './static'
            },
            './xxx'
            // 可使用 CopyWebpackPlugin 可复制 global.css 到 static 目录用于全局样式覆盖
            {
                from: './conf/global.css',
                to: './static/global.css',
                force: true // 文件已存在，需覆盖
            }
        ], {
            ignore: ['*.md']
        })
    ]
};
```

## babel 配置
* 当前项目内的 .babelrc 可作为 babel-loader 的配置生效
* .babelrc 与 babel-loader options 配置项的优先级待确认

## 业务模块内代码导出配置
* 业务模块项目(Client) 配置 `./src/client/index.js`

```javascript
/***
 * pages 用于设置当前 Client 的各个页面节点
 * pages[key] 中的 key 值对应路由信息，前后均不能存在 '/'
 * 
 * 通过 path 或 dependency 可指定用于导出的文件位置
 * @path 指定相对于当前项目/src/client 的路径
 * @dependency 是指通过以来包的形式加载远程项目
 * 两者只能同时设置其中一个
*/
module.exports = {
    pages: {
        'A/B': {
            path: 'A/B'
        },
        'A/C': {
            dependency: '...'
        }
    }
};
```

* 业务模块页面(Page) 导出 `./src/client/**/index.js`

```javascript
// 该文件在生成的 webpack 入口文件内被引用，可参考 ./temp/**.js 了解其使用方式
import state from './state';
import reducers from './reducers';
import AppContainer from './App';
import routes from './routes';
// ...

export default config => ({
    state,
    reducer: reducers,
    component: AppContainer, // 模块主组件
    routes // 路由配置
    // ...
});
```

## 本项目文件结构

```javascript
├─ bin // CLI 入口
│      web-tools.js
│      
├─ conf // 默认配置
│      theme.default.less // 默认 antd 主题
│      tools.default.conf.js // tools 默认配置
│      webpack.dev.conf.js // webpack 开发环境下默认配置
│      webpack.prod.conf.js // webpack 生产环境下默认配置
│                    
├─ plugins // 自定义插件
│     └─ add-var-text-html-webpack-plugin // 为在生产环境下使用相对路径，自行实现的插件
│             addVarToFileLoader.js
│             index.js
│          
├─ scripts // 核心代码
│     │  build.js // web-tools build
│     │  start.js // web-tools start
│     │  
│     └─ utils
│             env.js // 环境常量
│             tools.js // 工具函数
│          
└─ template // 模板文件
        entryfile.tpl // webpack 入口文件模板
        index.ejs // html-webpack-plugin 所需 html 模板
        index.js // 开发环境下 dev-server 使用的 html 模板（考虑到 html 文件可能非常多，故开发环境下未使用 html-webpack-plugin，以提升性能）
```
