module.exports = {
  tags: ['authorised', 'authorised-single'],
  'Authorised checkout, single product': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const categoryPage = browser.page.category();
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

    homepage.navigate();

    app.selectCategoryInNav('sofas');

    browser.pause(500);
    app.popUp();
    browser.pause(500);
    categoryPage.selectProductFromPage(1);
    productpage.buyProduct();
    checkoutpage.waitForOrderPage();
    browser.pause(500);

    checkoutpage.proceedToAddress()
                .choosePrevAdd()
                .authProceedToPayment(500)
                .selectCOD()
                .placeOrder()
                .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('end_to_end@tester.com');
    // checkoutpage.proceedToAddress()
    //             .addAddress({
    //               name: 'John Doe',
    //               email: 'swaroop@gozefo.com',
    //               phoneNumber: '9945139749',
    //               pinCode: '560037',
    //               address: '#12, Hello World Mansion, 3rd Main, OMBR Layout',
    //             })
    //             .saveAddress();
    // browser.pause(500);
    // checkoutpage.selectCOD()
    //             .proceedToPayment();
  },
  after: (browser) => browser.pause(2000).end(),
};
