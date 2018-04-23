module.exports = {
  url() {
    return `${this.api.launch_url}/checkout`;
  },


  commands: [{
    proceedToAddress() {
      const el = this.elements.proceedToAddressBtn.selector;
      this.waitForElementVisible(el);
      this.scrollToElement(el, 100); // custom command
      this.api.pause(500);
      return this.click(el);
    },

    addNewAddress(data) {
      const el = this.elements.addNewAddressBtn.selector;
      this.waitForElementVisible(el);
      this.api.pause(500);
      this.click(el);

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

    addNewGuestAddress(data) {
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

    deliverHere() {
      this.waitForElementVisible('@deliverHereBtn');
      this.api.pause(500);
      return this.click('@deliverHereBtn');
    },

    submitAddressForm() {
      this.api.submitForm(this.elements.submitAddress.selector);

      return this;
    },

    orderConfirmation() {
      return this.waitForElementVisible('@orderDetails');
    },

    proceedToPayment() {
      return this.waitForElementVisible('@paymentDetails');
    },

    placeOrder() {
      this.waitForElementVisible('@placeOrderBtn');
      this.api.pause(500);
      return this.click('@placeOrderBtn');
    },

  }],

  elements: {
    proceedToAddressBtn: {
      selector: '//button[text()="PROCEED TO NEXT STEP"]',
      locateStrategy: 'xpath',
    },

    submitAddress: {
      selector: '//button[(text()="Choose Payment Options") or (text()="Save & Deliver here")]',
      locateStrategy: 'xpath',
    },


    choosePaymentOptionsBtn: {
      selector: '//button[text()="Choose Payment Options"]',
      locateStrategy: 'xpath',
    },

    paymentDetails: {
      selector: '//li[text()="Cash/Card on Delivery"]',
      locateStrategy: 'xpath',
    },

    orderDetails: {
      selector: '//div/p[contains(text(), "Order Id")]',
      locateStrategy: 'xpath',
    },

    addNewAddressBtn: {
      selector: '//button[(text() ="ADD NEW ADDRESS")] | //input[@name="name"]',
      locateStrategy: 'xpath',
    },

    deliverHereBtn: {
      selector: '//button[contains(text(),"DELIVER HERE")]',
      locateStrategy: 'xpath',
    },

    placeOrderBtn: {
      selector: '//button[contains(text(),"Place Order")]',
      locateStrategy: 'xpath',
    },
  },
};
