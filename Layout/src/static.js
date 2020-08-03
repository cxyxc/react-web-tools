/**
 * 无法使用 webpack 的静态资源相关配置
 *
 * 本项目 static 目录下的文件会被 copy 到 web-main 的产出物内
 * 产出的 html 则会根据如下配置自动引入资源
 * static/styles/bootstrap.css 应配置为 styles/bootstrap.css
 */

const fs = require('fs');
const path = require('path');
const template = require('lodash/template');

const compiledTemplate = template(fs.readFileSync(path.join(__dirname, './index.tpl')));

module.exports = {
    assetsPath: path.join(__dirname, '../static'),
    styles: [
        /*
        'vendors/font-awesome/css/font-awesome.css',
        'vendors/simple-line-icons/simple-line-icons.css',
        'vendors/bootstrap/css/bootstrap.css',
        'vendors/pace/pace.css',
        'vendors/metronic/global/css/components-rounded.css',
        'vendors/metronic/global/css/plugins.css',
        'vendors/metronic/layouts/layout/css/layout.css',
        'vendors/metronic/layouts/layout/css/themes/default.css'
        */
    ],
    scripts: [
        /*
        'vendors/jquery.min.js',
        'vendors/js.cookie.min.js',
        'vendors/bootstrap/js/bootstrap.js',
        'vendors/jquery-slimscroll/jquery.slimscroll.js',
        'vendors/pace/pace.min.js',
        'vendors/metronic/metronic.js'
        */
    ],
    releaseMapping: [
        /*
        [['img/**', 'vendors/metronic/global/img/*', '!vendors/metronic/global/img/loading-spinner*'], 'img'],
        ['vendors/metronic/global/img/loading-spinner*', 'vendors/metronic/global/img'],
        ['vendors/metronic/global/img/flags/**', 'vendors/metronic/global/img/flags'],
        [['vendors/font-awesome/fonts/**', 'vendors/bootstrap/fonts/**'], 'fonts'],
        ['vendors/simple-line-icons/fonts/**', 'styles/fonts']
        */
    ],
    getIndexContent: (title, styles, scripts, basePath = '', root = 'shell') => compiledTemplate({
        title,
        styles,
        scripts,
        basePath,
        root
    })
};
