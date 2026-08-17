const {
    When,
    Then
} = require('@cucumber/cucumber');

const CartPage =
    require('../pages/CartPage');

const CheckoutPage =
    require('../pages/CheckoutPage');

const ConfirmationPage =
    require('../pages/ConfirmationPage');

const checkoutData =
    require('../test-data/checkout.json');


When(
    'I checkout',
    async function () {

        const cartPage =
            new CartPage(this.page);

        await cartPage.checkout();
    }
);


Then(
    'I should see the checkout information page',
    async function () {

        const checkoutPage =
            new CheckoutPage(this.page);

        await checkoutPage.verifyCheckoutPage();
    }
);


When(
    'I enter valid customer information',
    async function () {

        const checkoutPage =
            new CheckoutPage(this.page);

        const customer =
            checkoutData.validCustomer;

        await checkoutPage.enterCustomerInformation(
            customer.firstName,
            customer.lastName,
            customer.postalCode
        );
    }
);


When(
    'I continue checkout',
    async function () {

        const checkoutPage =
            new CheckoutPage(this.page);

        await checkoutPage.continue();
    }
);


When(
    'I complete the order',
    async function () {

        const confirmationPage =
            new ConfirmationPage(this.page);

        await confirmationPage.finishOrder();
    }
);


Then(
    'I should see the order confirmation',
    async function () {

        const confirmationPage =
            new ConfirmationPage(this.page);

        await confirmationPage.verifyOrderCompleted();
    }
);


Then(
    'I should see the checkout error message',
    async function () {

        const checkoutPage =
            new CheckoutPage(this.page);

        await checkoutPage.verifyErrorMessage(
            'Error: First Name is required'
        );
    }
);