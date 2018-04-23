module.exports = {
  tags: ['guest-bulk', 'guest'],
  'Guest checkout, bulk products': (browser) => {
    const homepage = browser.page.home();
    const app = browser.page.app();
    const productpage = browser.page.product();
    const checkoutpage = browser.page.checkout();
    const orderpage = browser.page.order();

    homepage.navigate();

    app.waitForCityChooserModal()
       .selectCityInModal()
       .waitForCityChange();

    browser.url(`${browser.launch_url}/${browser.globals.appCity}/category/office/office-chairs`);

    browser.pause(500);

    productpage.availBulk();

    browser.pause(500);

    productpage.quantity()
              .changeQuantity(1)
              .buyProduct();

    orderpage.waitForOrderPage();

    productpage.quantity()
               .changeQuantity(2);

    browser.pause(500);
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
