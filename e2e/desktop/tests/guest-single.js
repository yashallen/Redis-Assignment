module.exports = {
  tags: ['guest-single', 'guest'],
  'Guest checkout, single product': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const checkoutpage = browser.page.checkout();
    const orderpage = browser.page.order();

    homepage.navigate();

    app.waitForCityChooserModal()
       .selectCityInModal()
       .waitForCityChange();

    homepage.selectProductFromPage(3);

    productpage.buyProduct();

    checkoutpage.proceedToAddress();
    orderpage.waitForOrderPage();
    browser.pause(500);
    checkoutpage.addNewGuestAddress({
      name: 'John Doe',
      email: 'swaroop@gozefo.com',
      phoneNumber: '9945139749',
      pinCode: '560037',
      address: '#12, Hello World Mansion, 3rd Main, OMBR Layout',
    })
      .submitAddressForm()
      .proceedToPayment()
      .placeOrder()
      .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('swaroop@gozefo.com');
  },

  after: (browser) => browser.pause(1000).end(),
};
