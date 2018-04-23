const util = require('util');

module.exports = {
  commands: [{
    buyProduct() {
      return this.waitForElementVisible('@buyNow')
          .click('@buyNow');
    },
    availBulk() {
      const el = this.elements.availBulk.selector;
      this.waitForElementVisible(el);
      this.scrollToElement(el, 100); // custom command
      return this.getElementByXpath(el);  // custom command.
    },
    getBulkMaxCount(i) {
      this.api.getAttribute(this.elements.bulkMaxCount.selector, 'value', (result) => {
        this.assert.equal(typeof result, 'object');
        this.assert.equal(result.status, 0);
        const bulkMaxCount = result.value;
        let index = bulkMaxCount - i;
        index = ((index < 1) ? i : index);
        const el = util.format(this.elements.changeQuantity.selector, index);
        return this.waitForElementVisible(el)
            .click(el);
      });
      return this;
    },

    quantity() {
      this.waitForElementVisible('@quantity')
                .click('@quantity');
      return this;
    },

    changeQuantity(i) {
      this.getBulkMaxCount(i);
      return this;
    },
  }],

  elements: {
    buyNow: {
      selector: '//button[text()="BUY NOW"]',
      locateStrategy: 'xpath',
    },
    bulkMaxCount: {
      selector: '//div/select/option[last()]',
      locateStrategy: 'xpath',
    },
    availBulk: {
      selector: '//span[text()="Available in Bulk"]',
      locateStrategy: 'xpath',
    },
    quantity: {
      selector: '//div/select',
      locateStrategy: 'xpath',
    },
    changeQuantity: {
      selector: '//option[@value = %s]',
      locateStrategy: 'xpath',
    },
  },
};
