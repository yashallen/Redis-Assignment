module.exports = {
  tags: ['authorised', 'authorised-single'],
  'Authorised checkout, single product': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const checkoutpage = browser.page.checkout();
    const orderpage = browser.page.order();

    homepage.navigate();

    app.waitForCityChooserModal()
       .selectCityInModal()
       .waitForCityChange();

    browser.pause(500);

    app.openLoginModal();

    browser.pause(500);

    app.enterTestCredentials()
            .signIn();

    browser.pause(500);

    homepage.waitForProductVisibilty();   // Here,just validating login. without validating it will move to next command irrespective of login access.

    homepage.clearSession();

    browser.pause(1000);

    homepage.navigate();

    homepage.selectProductFromPage(3);

    productpage.buyProduct();

    orderpage.waitForOrderPage();

    checkoutpage.proceedToAddress()
                .deliverHere()
                .proceedToPayment()
                .placeOrder()
                .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('end_to_end@tester.com');

    // browser.pause(500);
    // checkoutpage.addNewAddress({
    //   name: 'John Doe',
    //   email: 'swaroop@gozefo.com',
    //   phoneNumber: '9945139749',
    //   pinCode: '560037',
    //   address: '#12, Hello World Mansion, 3rd Main, OMBR Layout',
    // })
    //   .submitAddressForm()
    //   .proceedToPayment();
  },

  after: (browser) => browser.pause(1000).end(),
};
