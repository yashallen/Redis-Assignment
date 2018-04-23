module.exports = {
  commands: [{
    waitForOrderPage() {
      const el = this.elements.orderPage.selector;
      return this.waitForElementVisible(el);
    },

    removeProductFromCart() {
      const el = this.elements.removeProduct.selector;
      return this.waitForElementVisible(el).click(el);
    },

    undoRemoveProduct() {
      const el = this.elements.undoRemove.selector;
      return this.waitForElementVisible(el).click(el);
    },

    applyCoupon() {
      const elem = this.elements.applyCoupon.selector;
      this.waitForElementVisible(elem);
      this.getElementByXpath(elem);       // custom command
      this.api.pause(500);
      this.waitForCouponModal();
      this.api.pause(500);
      this.useCoupon()
          .submitCoupon();
      return this;
    },

    waitForCouponModal() {
      return this.waitForElementVisible(this.elements.couponModal.selector);
    },

    useCoupon() {
      const el = this.elements.useCoupon.selector;
      return this.waitForElementVisible(el).click(el);
    },

    submitCoupon() {
      const el = this.elements.submitCoupon.selector;
      return this.waitForElementVisible(el).click(el);
    },

  }],

  elements: {
    orderPage: {
      selector: '//div/p[contains(text(), "Order Summary")]',
      locateStrategy: 'xpath',
    },
    removeProduct: {
      selector: '//div/span[contains(text(),"Order Summary")]/parent::*/following-sibling::div//div[3]//*[name()="svg"]',
      locateStrategy: 'xpath',
    },
    undoRemove: {
      selector: '//strong[contains(text(),"Undo")]',
      locateStrategy: 'xpath',
    },
    applyCoupon: {
      selector: '//a[(contains(text(),"Apply Coupon")) or (contains(text(),"Edit Coupon"))]',
      locateStrategy: 'xpath',
    },
    couponModal: {
      selector: '//h4[(contains(text(),"Apply Coupon")) or (contains(text(),"Edit Coupon"))]',
      locateStrategy: 'xpath',
    },
    useCoupon: {
      selector: '//button[contains(text(),"TAP TO USE")]',
      locateStrategy: 'xpath',
    },
    submitCoupon: {
      selector: '//button[contains(text(),"Submit")]',
      locateStrategy: 'xpath',
    },
  },
};
