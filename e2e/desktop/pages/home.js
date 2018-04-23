const util = require('util');


module.exports = {
  url() {
    return `${this.api.launch_url}`;
  },

  commands: [{
    selectProductFromPage(i) {
      const el = util.format(this.elements.randomProductOnPage.selector, this.api.globals.appCity, i);
      this.waitForElementVisible(el);
      this.getElementByXpath(el);      // custom command
      return this;
    },

    waitForProductVisibilty() {
      const el = util.format(this.elements.randomProductOnPage.selector, this.api.globals.appCity, 1);
      this.waitForElementVisible(el);
      return this;
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
      selector: '(//a[starts-with(@href, "/%s/product")])[%s]',
      locateStrategy: 'xpath',
    },
  },
};
