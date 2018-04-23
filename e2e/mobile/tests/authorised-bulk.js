module.exports = {
  tags: ['authorised', 'authorised-bulk'],
  'Authorised checkout, bulk products': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const checkoutpage = browser.page.checkout();

    homepage.navigate();

    app.waitForCityChooserModal()
       .selectCityInModal()
       .waitForCityChange()
       .openMenu()
       .openLoginModal();

    browser.pause(500);

    app.enterTestCredentials()
       .signIn();

    browser.pause(500);

    homepage.clearSession();

    browser.pause(1000);

    browser.url(`${browser.launch_url}/${browser.globals.appCity}`);

    app.selectCategoryInNav('office');

    browser.pause(500);
    app.popUp();
    browser.pause(500);

    productpage.availBulk()
               .quantity()
               .changeQuantity(1);

    productpage.buyProduct();

    checkoutpage.waitForOrderPage();

    productpage.quantity()
               .changeQuantity(2);

    browser.pause(500);

    checkoutpage.proceedToAddress()
                .choosePrevAdd()
                .authProceedToPayment(500)
                .selectCOD()
                .placeOrder()
                .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('end_to_end@tester.com');
  },

  after: (browser) => browser.pause(2000).end(),
};
