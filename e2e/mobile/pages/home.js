const util = require('util');

module.exports = {
  url() {
    return `${this.api.launch_url}`;
  },

  commands: [{
    selectProductFromPage() {
      const el = util.format(this.elements.randomProductOnPage.selector, this.api.globals.appCity);
      return this.waitForElementVisible(el)
        .click(el);
    },

    clearSession() {
      return this.navigate(`${this.api.launch_url}/test/clear-session`);
    },

    orderCancel(email) {
      return this.navigate(`${this.api.launch_url}/test/order-cancel/?emailId=${email}`);
    },

  }],

  elements: {
    randomProductOnPage: {
      selector: '//a[starts-with(@href, "/%s/product")]',
      locateStrategy: 'xpath',
    },
  },
};
