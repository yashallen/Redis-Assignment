const util = require('util');

const getCityButtonText = (city) => {
  const mapping = {
    bangalore: 'Bangalore',
    ncr: 'Delhi, Gurgaon and Noida',
    mumbai: 'Mumbai',
    pune: 'Pune',
    mysore: 'Mysore',
    hyderbad: 'Hyderabad',
    chennai: 'Chennai',
  };

  try {
    return mapping[city];
  } catch (e) {
    throw new Error('City not found');
  }
};

module.exports = {
  commands: [{
    waitForCityChooserModal() {
      return this.waitForElementVisible(
        util.format(this.elements.cityChooserModalButton.selector, getCityButtonText(this.api.globals.appCity))
      );
    },

    selectCityInModal() {
      return this.click(
        util.format(this.elements.cityChooserModalButton.selector, getCityButtonText(this.api.globals.appCity))
      );
    },

    waitForCityChange() {
      return this.waitForElementVisible(
        util.format(this.elements.activeCityInDropdown.selector, getCityButtonText(this.api.globals.appCity))
      );
    },

    openLoginModal() {
      const elem = this.elements.loginButton.selector;
      this.waitForElementVisible(elem);
      this.getElementByXpath(elem);       // custom command
      return this;
    },

    enterTestCredentials() {
      return this.enterCredentials({
        email: 'end_to_end@tester.com',
        pass: 'zefopass',
      });
    },

    enterCredentials(data) {
      const el = this.elements.emailInput.selector;
      this.waitForElementVisible(el)
                 .api.setValue(el, data.email);

      const ele = this.elements.passwordInput.selector;
      this.waitForElementVisible(ele)
                 .api.setValue(ele, data.pass);

      return this;
    },

    signIn() {
      const el = this.elements.signInBtn.selector;
      return this.waitForElementVisible(el)
        .click(el);
    },

  }],
  elements: {
    cityChooserModalButton: {
      selector: '//div[contains(@class,"modal-base--sticky-top")]//p[text()="%s"]',
      locateStrategy: 'xpath',
    },

    activeCityInDropdown: {
      selector: '//div[@tabindex="-100"]//a[text()="%s"]',
      locateStrategy: 'xpath',
    },

    loginButton: {
      selector: '//a[contains(text(),"Login")]',
      locateStrategy: 'xpath',
    },
    emailInput: {
      selector: '//div[@role="tabpanel"]//input[@name="email"]',
      locateStrategy: 'xpath',
    },
    signInBtn: {
      selector: '//button[contains(text(),"Sign In")]',
      locateStrategy: 'xpath',
    },
    passwordInput: {
      selector: '//div[@role="tabpanel"]//input[@name="password"]',
      locateStrategy: 'xpath',
    },
  },
};
