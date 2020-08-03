const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = options => {
    const config = {
        entry: options.entry,
        mode: 'none',
        target: 'web',
        devtool: 'nosources-source-map',
        output: {
            pathinfo: true,
            path: path.resolve('./release'),
            filename: 'scripts/[name].[chunkhash].min.js'
        },
        resolve: {
            modules: [
                'node_modules'
            ],
            alias: {
                Shared: path.join(process.cwd(), './node_modules/@shsdt/web-shared/lib'),
                Shell: path.join(process.cwd(), './node_modules/@shsdt/web-shell/lib'),
                '@shsdt': path.join(process.cwd(), './node_modules/@shsdt'),
                react: path.join(process.cwd(), './node_modules/react'),
                rxjs: path.join(process.cwd(), './node_modules/rxjs'),
                moment: path.join(process.cwd(), './node_modules/moment'),
                immutable: path.join(process.cwd(), './node_modules/immutable')
            },
            extensions: ['.js', '.jsx', '*'],
            mainFields: ['browser', 'browserify', 'module', 'main'],
            symlinks: false
        },
        optimization: {
            splitChunks: {
                minSize: 100 * 1000,
                cacheGroups: {
                    vendors: {
                        test: options.vendorsTest,
                        name: 'vendors',
                        chunks: 'initial'
                    }
                }
            },
            minimize: true,
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    cache: false,
                    parallel: true,
                    uglifyOptions: {
                        output: {
                            comments: false,
                        }
                    }
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {safe: true}
                })
            ],
            runtimeChunk: {
                name: 'manifest'
            }
        },
        module: {
            rules: [{
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                loader: require.resolve('babel-loader')
            }, {
                test: /\.(js)?$/,
                include: path.resolve(process.cwd(), 'node_modules/superstruct'),
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [require.resolve('@babel/preset-env')],
                    plugins: [require.resolve('@babel/plugin-proposal-object-rest-spread')]
                }
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: require.resolve('css-loader'),
                    options: {
                        camelCase: true,
                        importLoaders: 1,
                        localIdentName: '[name]_[local]_[hash:base64:6]'
                    }
                }]
            }, {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, {
                    loader: require.resolve('css-loader')
                }, {
                    loader: require.resolve('less-loader'),
                    options: {
                        javascriptEnabled: true,
                        modifyVars: options.theme || {}
                    }
                }]
            }, {
                test: /\.(jpg|png|xlsx|xls)$/,
                loader: require.resolve('file-loader'),
                options: {
                    name: '[path][name].[ext]',
                    outputPath(name) {
                        return `assets/${name.replace('node_modules/', '')
                            .replace('@shsdt/', '').replace('lib/', '')
                            .replace('assets/', '')}`;
                    }
                }
            }]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"',
                PRODUCTION: true,
                DEBUG: false
            }),
            new MiniCssExtractPlugin({
                filename: 'styles/[name].[chunkhash].css'
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                title: options.title || '晨阑经销商管理系统',
                template: path.resolve(__dirname, '../template/index.ejs'),
                beforeReactDOM: options.beforeReactDOM,
                minify: {
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true
                }
            }),
            new CopyWebpackPlugin([{
                from: './node_modules/@shsdt/web-tools/static/global.css',
                to: './static/global.css'
            }]),
        ]
    };
    return config;
};
