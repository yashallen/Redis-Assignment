const util = require('util');

module.exports = {
  commands: [{
    selectProductFromPage(i) {
      const el = util.format(this.elements.randomProductOnPage.selector, this.api.globals.appCity, i);
      return this.waitForElementVisible(el)
        .click(el);
    },
  }],

  elements: {
    randomProductOnPage: {
      selector: '(//a[starts-with(@href, "/%s/product")])[%s]',
      locateStrategy: 'xpath',
    },
  },
};
