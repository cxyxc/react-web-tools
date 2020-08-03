const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = options => {
    const config = {
        entry: options.entry,
        mode: 'development',
        target: 'web',
        devtool: 'eval-source-map',
        output: {
            path: path.resolve('./output'),
            publicPath: '/',
            filename: '[name].js'
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
                cacheGroups: {
                    vendors: {
                        test: options.vendorsTest,
                        name: 'vendors',
                        chunks: 'initial'
                    }
                }
            },
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
                include: [path.resolve(process.cwd(), 'node_modules/superstruct')],
                loader: require.resolve('babel-loader')
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
                DEBUG: true
            }),
            new webpack.HotModuleReplacementPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                title: options.title || '晨阑经销商管理系统',
                template: path.resolve(__dirname, '../template/index.ejs'),
                beforeReactDOM: options.beforeReactDOM
            }),
            new CopyWebpackPlugin([{
                from: './node_modules/@shsdt/web-tools/static/global.css',
                to: './static/global.css'
            }]),
        ]
    };

    return config;
};
