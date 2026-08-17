const { expect } = require('@playwright/test');

class LoginPage {

    constructor(page) {
        this.page = page;

        // Locators
        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');

        this.loginButton = page.getByRole('button', {
            name: 'Login'
        });

        this.errorMessage = page.locator(
            '[data-test="error"]'
        );
    }

    async enterUsername(username) {
        await this.usernameInput.fill(username);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async login(username, password) {

        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    async verifyLoginPage() {

        await expect(
            this.loginButton
        ).toBeVisible();
    }

    async verifyErrorMessage(message) {

        await expect(
            this.errorMessage
        ).toContainText(message);
    }
}

module.exports = LoginPage;