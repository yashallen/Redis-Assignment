module.exports = {
  tags: ['authorised', 'authorised-actions'],
  'Authorised checkout actions(Undo, Apply Coupon)': (browser) => {
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
    checkoutpage.continueShopping();
    app.selectCategoryInNav('sofas');
    categoryPage.selectProductFromPage(2);
    productpage.buyProduct();
    checkoutpage.waitForOrderPage();

    browser.pause(500);
    checkoutpage.removeProductFromCart()
                .undoRemoveProductFromCart()
                .applyCoupon();
    browser.pause(1000);
    checkoutpage.proceedToAddress()
                .choosePrevAdd()
                .authProceedToPayment();
    browser.pause(500);
    checkoutpage.selectCOD()
                .placeOrder()
                .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('end_to_end@tester.com');
  },
  after: (browser) => browser.pause(2000).end(),
};
