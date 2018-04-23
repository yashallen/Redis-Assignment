module.exports = {
  url() {
    return `${this.api.launch_url}/checkout`;
  },


  commands: [{
    waitForOrderPage() {
      const el = this.elements.orderPage.selector;
      return this.waitForElementVisible(el);
    },

    continueShopping() {
      const el = this.elements.continueShoppingBtn.selector;
      this.waitForElementVisible(el);
      this.scrollToElement(el, 1600); // custom command
      return this.click(el);
    },

    removeProductFromCart() {
      return this.waitForElementVisible('@removeProductBtn')
      .click('@removeProductBtn');
    },

    undoRemoveProductFromCart() {
      return this.waitForElementVisible('@undoRemoveProductBtn').click('@undoRemoveProductBtn');
    },

    applyCoupon() {
      const elem = this.elements.applyCoupon.selector;
      this.waitForElementVisible(elem);
      this.api.execute('scrollTo(0,1600');
      this.getElementByXpath(elem);       // custom command
      this.waitForCouponModal()
          .useCoupon()
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

    proceedToAddress() {
      this.api.pause(1000);
      return this.waitForElementVisible('@proceedToAddressBtn')
        .click('@proceedToAddressBtn');
    },

    addAddress(data) {
      this.waitForElementVisible('@addNewAddressBtn').click('@addNewAddressBtn');
      this.api.pause(500);
      Object.keys(data)
        .forEach((key) => {
          if (key === 'address') {
            this.api.setValue(`//textarea[@name="${key}"]`, data[key]);
          } else {
            this.api.setValue(`//input[@name="${key}"]`, data[key]);
          }
        });

      return this;
    },

    choosePrevAdd() {
      return this.waitForElementVisible('@choosePrevAddBtn')
        .click('@choosePrevAddBtn');
    },

    submitAddressForm() {
      this.api.submitForm(this.elements.choosePaymentOptionsBtn.selector);
      return this;
    },

    saveAddress() {
      this.waitForElementVisible('@saveAddressBtn', 8000, false, (result) => {
        if (result.value) {
          this.click('@saveAddressBtn');
        }
      });
      return this;
    },

    authProceedToPayment() {
      this.waitForElementVisible('@choosePaymentOptionsBtn');
      return this.click('@choosePaymentOptionsBtn');
    },

    orderConfirmation() {
      return this.waitForElementVisible('@orderDetails');
    },

    placeOrder() {
      this.waitForElementVisible('@placeOrderBtn');
      this.api.pause(500);
      return this.click('@placeOrderBtn');
    },

    selectCOD() {
      this.waitForElementVisible('@codOption');
      this.api.moveToElement(this.elements.codOption.selector, 0, 0);
      this.api.mouseButtonClick(0);

      return this;
    },
  }],

  elements: {
    orderPage: {
      selector: '//section/p[contains(text(), "Order Summary")]',
      locateStrategy: 'xpath',
    },
    continueShoppingBtn: {
      selector: '//a[text()="Continue Shopping"]',
      locateStrategy: 'xpath',
    },

    removeProductBtn: {
      selector: '//span[contains(@class, "icon-delete")]/parent::button',
      locateStrategy: 'xpath',

    },

    undoRemoveProductBtn: {
      selector: '//div/button[text()="Undo"]',
      locateStrategy: 'xpath',
    },

    applyCoupon: {
      selector: '//a[(contains(text(),"Apply Coupon")) or (contains(text(),"Edit Coupon"))]',
      locateStrategy: 'xpath',
    },

    couponModal: {
      selector: '//span[text()="APPLY COUPON"]',
      locateStrategy: 'xpath',
    },

    useCoupon: {
      selector: '//button[contains(text(),"Tap to use")]',
      locateStrategy: 'xpath',
    },

    submitCoupon: {
      selector: '//button[contains(text(),"SUBMIT")]',
      locateStrategy: 'xpath',
    },

    proceedToAddressBtn: {
      selector: '//button[text()="CHOOSE DELIVERY DETAILS"]',
      locateStrategy: 'xpath',
    },

    choosePaymentOptionsBtn: {
      selector: '//button[text()="PROCEED TO PAYMENT"]',
      locateStrategy: 'xpath',
    },

    saveAddressBtn: {
      selector: '//button[text()="Save"]',
      locateStrategy: 'xpath',
    },

    addNewAddressBtn: {
      selector: '//a[@data-metrics-ga-action="delivery_address_button_click"] | //input[@name="name"]',
      locateStrategy: 'xpath',
    },

    choosePrevAddBtn: {
      selector: '//button[@data-metrics-ga-action="delivery_address_button_click"]',
      locateStrategy: 'xpath',
    },

    placeOrderBtn: {
      selector: '//button[text()="PLACE ORDER"]',
      locateStrategy: 'xpath',
    },

    orderDetails: {
      selector: '//p[contains(text(), "Order Summary")]',
      locateStrategy: 'xpath',
    },

    codOption: {
      selector: '//label[@for="1"]',
      locateStrategy: 'xpath',
    },
  },
};
