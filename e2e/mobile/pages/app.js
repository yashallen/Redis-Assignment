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
      this.waitForElementVisible('@hamburgerNavIcon');
      this.api.pause(500); // CSS transition to complete so the overlay goes off

      this.click('@hamburgerNavIcon');

      this.api.pause(500); // CSS transition to complete

      return this.waitForElementVisible(
        util.format(this.elements.activeCityInNav.selector, getCityButtonText(this.api.globals.appCity))
      );
    },

    openMenu() {
      this.waitForElementVisible('@openMenuIcon');
      this.api.pause(500); // CSS transition to complete so the overlay goes off

      this.click('@openMenuIcon');

      this.api.pause(500); // CSS transition to complete

      return this;
    },

    selectCategoryInNav(category) {
      const path = util.format(this.elements.categoryInNav.selector, this.api.globals.appCity, category);
      this.waitForElementVisible(path);
      this.scrollToElement(path, 200); // custom command
      return this.getElementByXpath(path); // custom command
    },

    closeNavDrawer() {
      this.waitForElementVisible('@navCloseIcon');
      this.api.pause(500); // CSS transition to complete so the overlay goes off
      this.click('@navCloseIcon');
      this.api.pause(500); // CSS transition to complete
      return this;
    },

    openLoginModal() {
      const el = this.elements.loginButton.selector;
      return this.waitForElementVisible(el);
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

    popUp() {
      this.waitForElementVisible('@popUpNoThanx', 8000, false, (result) => {
        if (result.value) {
          this.click('@popUpNoThanx').click('@popUpNoThanx');
        }
      });
      return this;
    },
  }],
  elements: {
    cityChooserModalButton: {
      selector: '//div//p[text()="%s"]',
    },

    activeCityInNav: {
      selector: '//nav//button[text()="%s"]',
      locateStrategy: 'xpath',
    },

    hamburgerNavIcon: {
      selector: '//span[contains(@class, "icon-hamburger")]',
      locateStrategy: 'xpath',
    },

    openMenuIcon: {
      selector: '//a[contains(text(),"Account")]',
      locateStrategy: 'xpath',
    },

    navCloseIcon: {
      selector: '//span[contains(@class, "icon-back")]',
      locateStrategy: 'xpath',
    },

    categoryInNav: {
      selector: '//a[starts-with(@href, "/%s/category/%s")]',
      locateStrategy: 'xpath',
    },

    loginButton: {
      selector: '//a[(contains(text(),"Sign In"))]',
      locateStrategy: 'xpath',
    },
    emailInput: {
      selector: '//input[@name="email"]',
      locateStrategy: 'xpath',
    },
    signInBtn: {
      selector: '//button[contains(text(),"SIGNIN NOW")]',
      locateStrategy: 'xpath',
    },
    passwordInput: {
      selector: '//input[@name="password"]',
      locateStrategy: 'xpath',
    },
    popUpNoThanx: {
      selector: '//button[@id="onesignal-popover-cancel-button"]',
      locateStrategy: 'xpath',
    },
  },
};
