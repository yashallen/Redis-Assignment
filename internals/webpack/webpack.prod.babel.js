// TODO: MAINTENANCE: keep webpack.docker.babel.js in sync

// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OfflinePlugin = require('offline-plugin');
const S3Plugin = require('webpack-s3-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const zefoConfig = require(path.join(process.cwd(), 'config/environments/', `${process.env.TEST_BUILD ? 'testBuild' : process.env.NODE_WEBPACK_ENV || 'production'}`));
const OneSignalPlugin = require('./plugins/OneSignalPlugin');
const SentryPlugin = require('webpack-sentry-plugin');
const shell = require('shelljs');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

const commonVendorChunks = ['babel-polyfill', 'react', 'react-dom', 'react-router', 'redux', 'immutable', 'raven-js', 'react-helmet', 'react-metrics', 'react-redux', 'react-router-redux', 'react-router-scroll', 'redux-immutable', 'redux-saga', 'reselect', 'styled-components', 'superagent', 'es6-promise'];

const appReleaseId = shell.exec('git rev-parse HEAD', { silent: true }).stdout.trim();

let extraPlugins = [];
if (typeof process.env.SOURCE_MAP_GEN === 'undefined') {
  extraPlugins.push(
    new OneSignalPlugin({
      publicPath: zefoConfig.assetCache.publicPath || '/',
    }));
  if (typeof process.env.UPLOAD_S3 !== 'undefined') {
    extraPlugins.push(
      new S3Plugin({
        exclude: /.*\.js*\.map/,
        s3Options: {
          accessKeyId: zefoConfig.s3Options.accessKeyId,
          secretAccessKey: zefoConfig.s3Options.secretAccessKey,
          region: zefoConfig.s3Options.region,
        },
        basePath: zefoConfig.assetCache.basePath,
        s3UploadOptions: {
          Bucket: zefoConfig.assetCache.s3Bucket,
          CacheControl: 'public, max-age=2592000',
        },
        cloudfrontInvalidateOptions: {
          DistributionId: zefoConfig.cloudfront.distributionId,
          Items: zefoConfig.cloudfront.invalidationPath,
        },
      }));
  }
}

if (typeof process.env.SOURCE_MAP_GEN !== 'undefined') {
  extraPlugins = extraPlugins.concat(new SentryPlugin({
    organization: zefoConfig.sentry.organization,
    project: zefoConfig.sentry.project,
    apiKey: zefoConfig.sentry.apiKey,
    release: appReleaseId,
    exclude: /\.html$/,
    deleteAfterCompile: true,
    filenameTransform: (filename) => `~/${zefoConfig.assetCache.sourceMapPrefix}/${filename}`,
  }));
}

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
    publicPath: zefoConfig.assetCache.publicPath || '/',
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
    // new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      __baseUrl__: `"${zefoConfig.baseUrl}"`,
      __socketUrl__: `"${zefoConfig.socketUrl}"`,
      __socketNamespace__: `"${zefoConfig.socket.namespace}"`,
      oneSignalAppId: `"${zefoConfig.oneSignalAppId}"`,
      sentryAppId: `"${zefoConfig.sentry.appId}"`,
      sentryAppSecret: `"${zefoConfig.sentry.secret}"`,
      appReleaseId: `"${appReleaseId}"`,
    }),

    new UglifyJSPlugin({
      sourceMap: true,
    }),

    // Minify and optimize the index.html
    new HtmlWebpackPlugin({
      template: 'app/mobile/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      favicon: `${process.cwd()}/app/mobile/favicon.png`,
      inject: true,
      filename: 'mobile-index.html',
      chunksSortMode: 'manual',
      chunks: ['vendor.mobile', 'mobile', 'socket'],
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: ['vendor.mobile', 'mobile'],
    }),

    new HtmlWebpackPlugin({
      template: 'app/desktop/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      favicon: `${process.cwd()}/app/mobile/favicon.png`,
      inject: true,
      filename: 'desktop-index.html',
      chunksSortMode: 'manual',
      chunks: ['vendor.desktop', 'desktop', 'socket'],
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: ['vendor.desktop', 'desktop'],
    }),

    // Put it in the end to capture all the HtmlWebpackPlugin's
    // assets manipulations and do leak its manipulations to HtmlWebpackPlugin
    new OfflinePlugin({
      relativePaths: false,
      publicPath: zefoConfig.assetCache.publicPath || '/',

      updateStrategy: 'changed',
      autoUpdate: true,

      // No need to cache .htaccess. See http://mxs.is/googmp,
      // this is applied before any match in `caches` section
      excludes: ['.htaccess', 'mobile-index.html', 'desktop-index.html'],

      caches: {
        main: [':rest:'],

        // All chunks marked as `additional`, loaded after main section
        // and do not prevent SW to install. Change to `optional` if
        // do not want them to be preloaded at all (cached only when first loaded)
        optional: ['*.chunk.js'],
      },

      // version based on commit id will allow refresh cache on update
      version: appReleaseId,

      // Removes warning for about `additional` section usage
      safeToUseOptionalCaches: true,

      AppCache: false,

      ServiceWorker: {
        events: true,
        publicPath: '/sw.js',
      },

      // Hack
      // This is to skip the warning that OfflinePlugin throws if sw registration is not done
      __tests: {
        ignoreRuntime: true,
      },
    }),

  ].concat(extraPlugins),
});
