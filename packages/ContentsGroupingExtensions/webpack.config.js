const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

// eslint-disable-next-line no-unused-vars
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

const config = require('./rcms-js.config.js');
const pages = require('./pages.config.js');

const production = process.env.WEBPACK_MODE === 'production';
const serve = process.env.WEBPACK_DEV_SERVER;

const eslintNoFail = !production && process.env.RCMS_ESLINT_NO_FAIL_DEV;

const protocol = config.https ? 'https' : 'http';

module.exports = {
    mode: production ? 'production' : 'development',
    entry: pages,
    output: {
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, config.path),
        publicPath: (serve ? `${protocol}://${config.devHost}:${config.devPort}` : '') + config.publicPath,
        filename: serve ? '[name].[hash].js' : '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /src\/components\/ChildWysiwyg\/icons\//,
                use: ['raw-loader'],
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                use: ['raw-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[hash].[ext]',
                    limit: 8192,
                },
                exclude: [
                    /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    /src\/components\/ChildWysiwyg\/icons\//,
                ],
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true,
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig({
                            themeImporter: {
                                themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                            },
                            minify: true,
                        }),
                    },
                ],
            },
            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                options: {
                    failOnError: !eslintNoFail,
                    emitWarning: eslintNoFail,
                },
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [production ? MiniCssExtractPlugin.loader : 'vue-style-loader', 'css-loader', 'postcss-loader'],
                exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
            },
        ],
    },
    plugins: [
        new DefinePlugin({
            rcms_js_config: JSON.stringify(config),
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({ publicPath: '' }),
        new MiniCssExtractPlugin({
            filename: serve ? '[name].[hash].css' : '[name].[contenthash].css',
        }),
        new CKEditorWebpackPlugin({
            language: 'ja',
            addMainLanguageTranslationsToAllAssets: true,
        }),
        // new BundleAnalyzerPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 2016,
                    compress: true,
                    output: {
                        comments: false,
                        beautify: false,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: { discardComments: { removeAll: true } },
            }),
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    resolve: {
        alias: { '@': path.resolve(__dirname, 'src/') },
    },
    devServer: {
        host: config.devHost,
        port: config.devPort,
        static: {
            publicPath: config.publicPath,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        https:
            config.https && config.httpsKey
                ? {
                      key: fs.readFileSync(config.httpsKey),
                      cert: fs.readFileSync(config.httpsCert),
                      ca: fs.readFileSync(config.httpsCa),
                  }
                : config.https,
        watchFiles: ['src/**/*'],
    },
};
