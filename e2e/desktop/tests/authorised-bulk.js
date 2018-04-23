module.exports = {
  tags: ['authorised', 'authorised-bulk'],
  'Authorised checkout, bulk products': (browser) => {
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

    browser.url(`${browser.launch_url}/${browser.globals.appCity}/category/office/office-chairs`);

    productpage.availBulk();

    browser.pause(500);

    productpage.quantity()
               .changeQuantity(1)
               .buyProduct();

    orderpage.waitForOrderPage();

    productpage.quantity()
               .changeQuantity(2);

    checkoutpage.proceedToAddress()
                .deliverHere()
                .proceedToPayment()
                .placeOrder()
                .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('end_to_end@tester.com');
  },

  after: (browser) => browser.pause(1000).end(),
};
