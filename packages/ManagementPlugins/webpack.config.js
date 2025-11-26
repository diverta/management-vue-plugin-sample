const fs = require('fs');
const path = require('path');
const { DefinePlugin } = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

const config = require('./rcms-js.config.js');
const apiConfig = require('./rcms-api.config.js');
const pages = require('./pages.config.js');

const production = process.env.WEBPACK_MODE === 'production';
const serve = process.env.WEBPACK_DEV_SERVER;

const eslintNoFail = !production && !!process.env.RCMS_ESLINT_NO_FAIL_DEV;

const protocol = config.https ? 'https' : 'http';
const fullPublicPath = (serve ? `${protocol}://${config.devHost}:${config.devPort}` : '') + config.publicPath;

module.exports = {
  mode: production ? 'production' : 'development',
  entry: pages,
  output: {
    globalObject: 'self',
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, config.path),
    publicPath: fullPublicPath,
    filename: 'js/' + (serve ? '[name].[fullhash].js' : '[name].[chunkhash].js'),
  },

  module: {
    rules: [
      {
        test: /.vue$/,
        loader: 'vue-loader',
        options: {},
      },
      {
        test: /.js$/,
        exclude: /node_modules\/(?!jexl)/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
        type: 'asset',
        generator: {
          filename: '[name].[hash][ext]',
          publicPath: `${fullPublicPath}/`,
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8192,
          },
        },
        exclude: [],
      },
      {
        test: /\.(css|scss)$/,
        exclude: /styles/,
        use: [
          production ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              url: url => {
                // Don't handle images under root-relative /(management|images/management)/
                if (/^\/(management|images\/management)\//.test(url)) {
                  return false;
                }
                return true;
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-preset-env', {}],
                  ['postcss-import', {}],
                  ['postcss-nested', {}],
                  ['postcss-simple-vars', {}],
                  ...(production ? [['cssnano', {}]] : []),
                ],
              },
            },
          },
        ],
      },
      {
        test: /[/\\]styles[/\\].*\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
    new ESLintPlugin({
      context: path.resolve(__dirname),
      extensions: ['js', 'vue'],
      exclude: 'node_modules/',
      failOnError: !eslintNoFail,
      emitWarning: !eslintNoFail,
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin({ publicPath: '' }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: pathData => {
        // Should be static path
        if (pathData.chunk.name.indexOf('css/') === 0) {
          return '[name].css';
        } else {
          return serve ? '[name].[hash].css' : '[name].[contenthash].css';
        }
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ja/),
    new DefinePlugin({
      'process.env': {
        ...Object.keys(apiConfig).reduce(
          (values, k) => ({
            ...values,
            [k]: JSON.stringify(apiConfig[k]),
          }),
          {}
        ),
      },
      rcms_js_config: JSON.stringify(config),
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
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
  devServer: {
    host: config.devHost,
    port: config.devPort,
    devMiddleware: {
      publicPath: config.publicPath,
    },
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    server: (() => {
      if (config.https) {
        return {
          type: 'https',
          options: config.httpsKey
            ? {
                key: fs.readFileSync(config.httpsKey),
                cert: fs.readFileSync(config.httpsCert),
                ca: fs.readFileSync(config.httpsCa),
              }
            : {},
        };
      } else {
        return {
          type: 'http',
        };
      }
    })(),
  },
};
