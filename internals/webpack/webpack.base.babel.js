/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

module.exports = (options) => ({
  entry: options.entry,
  output: Object.assign({ // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: options.babelQuery,
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: /node_modules/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.svg$/,
      loader: 'babel-loader?presets[]=es2015,presets[]=react!svg-react-loader',
      exclude: /desktop/,
    }, {
      test: /\.svg$/,
      loaders: [
        'babel-loader?presets[]=es2015,presets[]=react',
        'svg-react-loader',
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeXMLNS: true },
              { removeTitle: true },
              { removeDesc: true },
              { removeEmptyAttrs: true },
              { convertColors: true },
              { removeUselessStrokeAndFill: true },
              { removeStyleElement: true },
              { removeScriptElement: true },
            ],
          },
        },
      ],
      include: /app\/desktop/,
    }, {
      test: /\.(jpg|png|gif)$/,
      loaders: [
        'file-loader',
        {
          loader: 'image-webpack-loader',
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: false,
            },
            optipng: {
              optimizationLevel: 7,
            },
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      ],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.(mp4|webm)$/,
      loader: 'url-loader?limit=10000',
    }],
  },
  plugins: options.plugins.concat([
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      __baseUrl__: '""',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NormalModuleReplacementPlugin(/^(containers|reducers|components|styles|assets)\/?/, (result) => {
      const { context } = result;
      const mobilePattern = /\/app\/mobile\/?/;
      const desktopPattern = /\/app\/desktop\/?/;

      if (mobilePattern.test(context)) {
        return Object.assign(result, { request: path.join('mobile', result.request) });
      }

      if (desktopPattern.test(context)) {
        return Object.assign(result, { request: path.join('desktop', result.request) });
      }

      return result;
    }),
  ]),
  resolve: {
    alias: {
      mobile: path.join(__dirname, '../../app/mobile'),
      desktop: path.join(__dirname, '../../app/desktop'),
    },
    modules: ['app', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'main',
      'jsnext:main',
    ],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});
