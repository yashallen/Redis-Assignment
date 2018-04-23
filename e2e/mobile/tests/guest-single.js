module.exports = {
  tags: ['guest', 'guest-single'],
  'Guest checkout, single product': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const categoryPage = browser.page.category();
    const checkoutpage = browser.page.checkout();

    homepage.navigate();

    app.waitForCityChooserModal()
       .selectCityInModal()
       .waitForCityChange()
       .selectCategoryInNav('sofas');

    browser.pause(500);
    app.popUp();
    browser.pause(500);

    categoryPage.selectProductFromPage(1);

    productpage.buyProduct();

    checkoutpage.waitForOrderPage()
                .proceedToAddress()
                .addAddress({
                  name: 'John Doe',
                  email: 'swaroop@gozefo.com',
                  phoneNumber: '9945139749',
                  pinCode: '560037',
                  address: '#12, Hello World Mansion, 3rd Main, OMBR Layout',
                })
                .submitAddressForm()
                .selectCOD()
                .placeOrder()
                .orderConfirmation();

    browser.pause(1000);

    homepage.orderCancel('swaroop@gozefo.com');
  },

  after: (browser) => browser.pause(2000).end(),
};
