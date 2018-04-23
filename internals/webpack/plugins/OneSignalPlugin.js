function OneSignalPlugin(options) {
  this.options = options;
}

const generateSWCode = function generateSWCode({ publicPath }) {
  const timestamp = Date.now();
  const swPath = `${publicPath}sw.js`;


  return `
importScripts('${swPath}?hash=${timestamp}');
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDK.js');
  `;
};

OneSignalPlugin.prototype.apply = function oneSignalApply(compiler) {
  const { options } = this;

  compiler.plugin('emit', (compilation, callback) => {
    const code = generateSWCode(options);
    const obj = {
      source: () => code,
      size: () => code.length,
    };

    compilation.assets['OneSignalSDKWorker.js'] = obj; // eslint-disable-line no-param-reassign
    compilation.assets['OneSignalSDKUpdaterWorker.js'] = obj; // eslint-disable-line no-param-reassign

    callback();
  });
};

module.exports = OneSignalPlugin;
