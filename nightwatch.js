const SCREENSHOT_PATH = '/tmp/screenshots/';
const DEVICE = process.env.APP_DEVICE;
const CITY = process.env.APP_CITY;
// const USE_HEADLESS = process.env.USE_HEADLESS && process.env.USE_HEADLESS === 'TRUE';

// we use a nightwatch.conf.js file so we can include comments and helper functions
module.exports = {
  src_folders: [
    `e2e/${DEVICE}/tests`,
  ],
  page_objects_path: `./e2e/${DEVICE}/pages`,
  custom_commands_path: './e2e/helper',
  output_folder: './reports', // reports (test outcome) output by nightwatch
  selenium: { // downloaded by selenium-download module (see readme)
    start_process: true, // tells nightwatch to start/stop the selenium process
    server_path: './essentials/selenium.jar',
    host: '127.0.0.1',
    port: 4444, // standard selenium port
    cli_args: { // chromedriver is downloaded by selenium-download (see readme)
      'webdriver.chrome.driver': './essentials/chromedriver',
    },
  },
  test_settings: {
    default: {
      launch_url: 'https://test.gozefo.com',
      selenium_port: 4444,
      selenium_host: 'localhost',
      use_xpath: true,
      screenshots: {
        enabled: false, // if you want to keep screenshots
        path: SCREENSHOT_PATH, // save screenshots here
      },
      globals: {
        waitForConditionTimeout: 10000, // sometimes internet is slow so wait.
        appCity: CITY || 'bangalore',
      },
      desiredCapabilities: {
        javascriptEnabled: true,
        acceptSslCerts: true,
        browserName: 'chrome',
        chromeOptions: {
          args: ['headless', 'no-sandbox', 'disable-gpu', 'window-size=1100,800'],
        },
      },
    },
    chromeMobile: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true, // turn off to test progressive enhancement
        chromeOptions: {
          mobileEmulation: {
            deviceName: 'Galaxy S5',
          },
        },
      },
    },
  },
};
