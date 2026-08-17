const {
    When,
    Then
} = require('@cucumber/cucumber');

const ProductsPage = require('../pages/ProductsPage');


// ======================================================
// PRODUCT VALIDATION
// ======================================================

Then(
    'I should see products displayed',
    async function () {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.verifyProductsDisplayed();
    }
);


Then(
    'I should see {int} products',
    async function (count) {

        const productsPage =
            new ProductsPage(this.page);

        const actualCount =
            await productsPage.getProductCount();

        if (actualCount !== count) {

            throw new Error(
                `Expected ${count} products but found ${actualCount}`
            );
        }
    }
);


// ======================================================
// PRODUCT CART ACTIONS
// ======================================================

When(
    'I add {string} to the cart',
    async function (productName) {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.addProduct(
            productName
        );
    }
);


When(
    'I remove {string} from the products page',
    async function (productName) {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.removeProduct(
            productName
        );
    }
);


Then(
    'the cart should contain {int} item',
    async function (count) {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.verifyCartCount(
            count
        );
    }
);


Then(
    'the cart should contain {int} items',
    async function (count) {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.verifyCartCount(
            count
        );
    }
);


// ======================================================
// PRODUCT SORTING
// ======================================================

When(
    'I sort products by {string}',
    async function (sortOption) {

        const productsPage =
            new ProductsPage(this.page);

        const sortValues = {

            'Price (low to high)': 'lohi',

            'Price (high to low)': 'hilo',

            'Name (A to Z)': 'az',

            'Name (Z to A)': 'za'
        };

        const sortValue =
            sortValues[sortOption];

        if (!sortValue) {

            throw new Error(
                `Unknown sort option: ${sortOption}`
            );
        }

        await productsPage.sortProducts(
            sortValue
        );
    }
);


Then(
    'products should be sorted by price low to high',
    async function () {

        const prices =
            await this.page
                .locator('.inventory_item_price')
                .allTextContents();

        const numericPrices =
            prices.map(price =>
                Number(
                    price.replace('$', '')
                )
            );

        const sortedPrices =
            [...numericPrices].sort(
                (a, b) => a - b
            );

        if (
            JSON.stringify(numericPrices) !==
            JSON.stringify(sortedPrices)
        ) {

            throw new Error(
                'Products are not sorted from low to high'
            );
        }
    }
);