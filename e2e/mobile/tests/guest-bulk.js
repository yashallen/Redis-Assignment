module.exports = {
  tags: ['guest', 'guest-bulk'],
  'Guest checkout, bulk products': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const checkoutpage = browser.page.checkout();

    homepage.navigate();

    app.waitForCityChooserModal()
       .selectCityInModal()
       .waitForCityChange()
       .selectCategoryInNav('office')
       .selectCategoryInNav('office/office-chairs');

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

    checkoutpage.proceedToAddress()
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
