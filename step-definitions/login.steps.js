const {
    Given,
    When,
    Then
} = require('@cucumber/cucumber');

const LoginPage = require('../pages/LoginPage');
const ProductsPage = require('../pages/ProductsPage');

const users = require('../test-data/users.json');


// ======================================================
// LOGIN
// ======================================================

Given('I am on the login page', async function () {

    const loginPage = new LoginPage(this.page);

    await loginPage.verifyLoginPage();
});


Given(
    'I am logged in with valid credentials',
    async function () {

        const loginPage = new LoginPage(this.page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );
    }
);


When(
    'I login with valid credentials',
    async function () {

        const loginPage = new LoginPage(this.page);

        await loginPage.login(
            users.validUser.username,
            users.validUser.password
        );
    }
);


When(
    'I login with invalid credentials',
    async function () {

        const loginPage = new LoginPage(this.page);

        await loginPage.login(
            users.invalidUser.username,
            users.invalidUser.password
        );
    }
);


When(
    'I login with locked user credentials',
    async function () {

        const loginPage = new LoginPage(this.page);

        await loginPage.login(
            users.lockedUser.username,
            users.lockedUser.password
        );
    }
);


// ======================================================
// LOGIN VALIDATIONS
// ======================================================

Then(
    'I should see the products page',
    async function () {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.verifyProductsPage();
    }
);


Then(
    'I should see a login error message',
    async function () {

        const loginPage =
            new LoginPage(this.page);

        await loginPage.verifyErrorMessage(
            'Username and password do not match'
        );
    }
);


Then(
    'I should see a locked user error message',
    async function () {

        const loginPage =
            new LoginPage(this.page);

        await loginPage.verifyErrorMessage(
            'Sorry, this user has been locked out.'
        );
    }
);


// ======================================================
// LOGOUT
// ======================================================

When(
    'I logout from the application',
    async function () {

        const productsPage =
            new ProductsPage(this.page);

        await productsPage.logout();
    }
);


Then(
    'I should return to the login page',
    async function () {

        const loginPage =
            new LoginPage(this.page);

        await loginPage.verifyLoginPage();
    }
);