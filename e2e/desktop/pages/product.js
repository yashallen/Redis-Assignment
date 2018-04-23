const util = require('util');
// let bulkMaxCount = 1;

module.exports = {
  commands: [{
    buyProduct() {
      return this.waitForElementVisible('@buyNow').click('@buyNow');
    },
    availBulk() {
      const el = this.elements.availBulk.selector;
      this.waitForElementVisible(el);
      this.scrollToElement(el, 100); // custom command
      return this.getElementByXpath(el);  // custom command
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
      selector: '//button[text()="Buy Now"]',
      locateStrategy: 'xpath',
    },
    availBulk: {
      selector: '//span[text()="Available in Bulk"]',
      locateStrategy: 'xpath',
    },
    bulkMaxCount: {
      selector: '//a[contains(text(),"Quantity:")]/parent::*/following-sibling::div/button[last()]',
      locateStrategy: 'xpath',
    },
    quantity: {
      selector: '//a[contains(text(),"Quantity:")]',
      locateStrategy: 'xpath',
    },
    changeQuantity: {
      selector: '//button[@value = %s]',
      locateStrategy: 'xpath',
    },
  },
};
