const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
    publicPath:
      (serve ? `${protocol}://${config.devHost}:${config.devPort}` : '') +
      config.publicPath,
    filename: serve ? '[name].[hash].js' : '[name].[chunkhash].js',
  },
  module: {
    rules: [
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
        test: /.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css|scss$/,
        use: [
          production ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[hash].[ext]',
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      rcms_js_config: JSON.stringify(config),
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new ManifestPlugin({ publicPath: '' }),
    new MiniCssExtractPlugin({
      filename: serve ? '[name].[hash].css' : '[name].[contenthash].css',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 5,
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
    publicPath: config.publicPath,
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
  },
};
