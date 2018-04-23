// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const zefoConfig = require(path.join(process.cwd(), 'config/environments/', `${process.env.NODE_WEBPACK_ENV || 'development'}`));
const shell = require('shelljs');

const commonVendorChunks = ['react', 'react-dom', 'react-router', 'redux', 'babel-polyfill', 'immutable', 'raven-js', 'react-helmet', 'react-metrics', 'react-redux', 'react-router-redux', 'react-router-scroll', 'redux-immutable', 'redux-saga', 'reselect', 'styled-components', 'superagent', 'es6-promise'];

const appReleaseId = shell.exec('git rev-parse HEAD', { silent: true }).stdout.trim();


module.exports = require('./webpack.base.babel')({
  // In production, we skip all hot-reloading stuff
  entry: {
    mobile: path.join(process.cwd(), 'app/mobile/app.js'),
    desktop: path.join(process.cwd(), 'app/desktop/app.js'),
    socket: path.join(process.cwd(), 'app/socket.js'),
    'vendor.desktop': commonVendorChunks,
    'vendor.mobile': commonVendorChunks,
  },

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',

    publicPath: './build/',
  },

  babelQuery: {
    presets: [
      ['es2015', { modules: false }],
      ['stage-0'],
    ],
  },

  devtool: typeof process.env.SOURCE_MAP_GEN === 'undefined' ? 'none' : 'source-map',

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor.mobile',
      filename: 'vendor.mobile.[chunkhash].js',
      chunks: ['mobile', 'vendor.mobile'],
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor.desktop',
      filename: 'vendor.desktop.[chunkhash].js',
      chunks: ['desktop', 'vendor.desktop'],
      minChunks: Infinity,
    }),

    // Merge all duplicate modules
    new webpack.DefinePlugin({
      __baseUrl__: `"${zefoConfig.baseUrl}"`,
      oneSignalAppId: `"${zefoConfig.oneSignalAppId}"`,
      sentryAppId: `"${zefoConfig.sentry.appId}"`,
      sentryAppSecret: `"${zefoConfig.sentry.secret}"`,
      appReleaseId: `"${appReleaseId}"`,
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/mobile/index.html',
      favicon: `${process.cwd()}/app/mobile/favicon.png`,
      inject: true,
      filename: 'mobile-index.html',
      chunksSortMode: 'manual',
      chunks: ['vendor.mobile', 'mobile'],
    }),

    new HtmlWebpackPlugin({
      template: 'app/desktop/index.html',
      favicon: `${process.cwd()}/app/mobile/favicon.png`,
      inject: true,
      filename: 'desktop-index.html',
      chunksSortMode: 'manual',
      chunks: ['vendor.desktop', 'desktop'],
    }),
  ],
});
