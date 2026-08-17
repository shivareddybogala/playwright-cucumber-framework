const {
    When,
    Then
} = require('@cucumber/cucumber');

const ProductsPage = require('../pages/ProductsPage');
const CartPage = require('../pages/CartPage');


// ======================================================
// OPEN CART
// ======================================================

When(
    'I open the shopping cart',
    async function () {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.openCart();
    }
);


// ======================================================
// CART VALIDATION
// ======================================================

Then(
    'I should see {string} in the cart',
    async function (productName) {

        const cartPage =
            new CartPage(this.page);

        await cartPage.verifyCartPage();

        await cartPage.verifyProductInCart(
            productName
        );
    }
);


// ======================================================
// REMOVE PRODUCT
// ======================================================

When(
    'I remove {string} from the cart',
    async function (productName) {

        const cartPage =
            new CartPage(this.page);

        await cartPage.removeProduct(
            productName
        );
    }
);


Then(
    'the cart should be empty',
    async function () {

        const cartPage =
            new CartPage(this.page);

        await cartPage.verifyCartIsEmpty();
    }
);


// ======================================================
// CONTINUE SHOPPING
// ======================================================

When(
    'I continue shopping',
    async function () {

        const cartPage =
            new CartPage(this.page);

        await cartPage.continueShopping();
    }
);