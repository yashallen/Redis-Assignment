/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const logger = require('../../server/logger');
const cheerio = require('cheerio');
const pkg = require(path.resolve(process.cwd(), 'package.json'));
const dllPlugin = pkg.dllPlugin;
const zefoConfig = require(path.join(process.cwd(), 'config/environments/', `${process.env.NODE_WEBPACK_ENV || 'development'}`));

const plugins = [
  new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
  new webpack.NoEmitOnErrorsPlugin(),
  new HtmlWebpackPlugin({
    inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
    templateContent: templateContent('app/mobile'), // eslint-disable-line no-use-before-define
    favicon: `${process.cwd()}/app/mobile/favicon.png`,
    filename: 'mobile-index.html',
    excludeChunks: ['desktop'],
  }),
  new HtmlWebpackPlugin({
    inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
    templateContent: templateContent('app/desktop'), // eslint-disable-line no-use-before-define
    favicon: `${process.cwd()}/app/desktop/favicon.png`,
    filename: 'desktop-index.html',
    excludeChunks: ['mobile'],
  }),
  // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
  // inside your code for any environment checks; UglifyJS will automatically
  // drop any unreachable code.
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
    __baseUrl__: '""',
    __socketUrl__: `"${zefoConfig.socketUrl}"`,
    __socketNamespace__: `"${zefoConfig.socket.namespace}"`,
  }),
];

module.exports = require('./webpack.base.babel')({
  // Add hot reloading in development
  entry: {
    'eventsource-polyfill': 'eventsource-polyfill', // Necessary for hot reloading with IE
    hmr: 'webpack-hot-middleware/client',
    mobile: path.join(process.cwd(), 'app/mobile/app.js'),
    desktop: path.join(process.cwd(), 'app/desktop/app.js'),
    socket: path.join(process.cwd(), 'app/socket.js'),
  },

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  // Add development plugins
  plugins: dependencyHandlers().concat(plugins), // eslint-disable-line no-use-before-define

  // Tell babel that we want to hot-reload
  babelQuery: {
    presets: ['react-hmre'],
  },

  // Emit a source map for easier debugging
  devtool: 'inline-source-map',
});

/**
 * Select which plugins to use to optimize the bundle's handling of
 * third party dependencies.
 *
 * If there is a dllPlugin key on the project's package.json, the
 * Webpack DLL Plugin will be used.  Otherwise the CommonsChunkPlugin
 * will be used.
 *
 */
function dependencyHandlers() {
  // Don't do anything during the DLL Build step
  if (process.env.BUILDING_DLL) { return []; }

  // If the package.json does not have a dllPlugin property, use the CommonsChunkPlugin
  if (!dllPlugin) {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true,
      }),
    ];
  }

  const dllPath = path.resolve(process.cwd(), dllPlugin.path || 'node_modules/react-boilerplate-dlls');

  /**
   * If DLLs aren't explicitly defined, we assume all production dependencies listed in package.json
   * Reminder: You need to exclude any server side dependencies by listing them in dllConfig.exclude
   *
   * @see https://github.com/mxstbr/react-boilerplate/tree/master/docs/general/webpack.md
   */
  if (!dllPlugin.dlls) {
    const manifestPath = path.resolve(dllPath, 'reactBoilerplateDeps.json');

    if (!fs.existsSync(manifestPath)) {
      logger.error('The DLL manifest is missing. Please run `npm run build:dll`');
      process.exit(0);
    }

    return [
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require(manifestPath), // eslint-disable-line global-require
      }),
    ];
  }

  // If DLLs are explicitly defined, we automatically create a DLLReferencePlugin for each of them.
  const dllManifests = Object.keys(dllPlugin.dlls).map((name) => path.join(dllPath, `/${name}.json`));

  return dllManifests.map((manifestPath) => {
    if (!fs.existsSync(path)) {
      if (!fs.existsSync(manifestPath)) {
        logger.error(`The following Webpack DLL manifest is missing: ${path.basename(manifestPath)}`);
        logger.error(`Expected to find it in ${dllPath}`);
        logger.error('Please run: npm run build:dll');

        process.exit(0);
      }
    }

    return new webpack.DllReferencePlugin({
      context: process.cwd(),
      manifest: require(manifestPath), // eslint-disable-line global-require
    });
  });
}

/**
 * We dynamically generate the HTML content in development so that the different
 * DLL Javascript files are loaded in script tags and available to our application.
 */
function templateContent(dir) {
  const html = fs.readFileSync(
    path.resolve(process.cwd(), `${dir}/index.html`)
  ).toString();

  if (!dllPlugin) { return html; }

  const doc = cheerio(html);
  const body = doc.find('body');
  const dllNames = !dllPlugin.dlls ? ['reactBoilerplateDeps'] : Object.keys(dllPlugin.dlls);

  dllNames.forEach((dllName) => body.append(`<script data-dll='true' src='/${dllName}.dll.js'></script>`));

  return doc.toString();
}
