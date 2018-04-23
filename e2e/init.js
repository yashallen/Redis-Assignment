const BINPATH = './node_modules/nightwatch/bin/';
const seleniumDownload = require('selenium-download');

require('fs').stat(`${BINPATH}selenium.jar`, (err, stat) => {
  if (err || !stat || stat.size < 1) {
    seleniumDownload.ensure(BINPATH, (error) => {
      if (error) throw new Error(error);
      console.log('✔ Selenium & Chromedriver downloaded to:', BINPATH); // eslint-disable-line
    });
  }
});
