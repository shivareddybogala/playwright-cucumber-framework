const { expect } = require('@playwright/test');

class CheckoutPage {

    constructor(page) {

        this.page = page;

        this.checkoutTitle =
            page.getByText(
                'Checkout: Your Information',
                { exact: true }
            );

        this.firstName =
            page.getByPlaceholder('First Name');

        this.lastName =
            page.getByPlaceholder('Last Name');

        this.postalCode =
            page.getByPlaceholder('Zip/Postal Code');

        this.continueButton =
            page.getByRole('button', {
                name: 'Continue'
            });

        this.cancelButton =
            page.getByRole('button', {
                name: 'Cancel'
            });

        this.errorMessage =
            page.locator('[data-test="error"]');
    }


    async verifyCheckoutPage() {

        await expect(
            this.checkoutTitle
        ).toBeVisible();
    }


    async enterCustomerInformation(
        firstName,
        lastName,
        postalCode
    ) {

        await this.firstName.fill(firstName);

        await this.lastName.fill(lastName);

        await this.postalCode.fill(postalCode);
    }


    async continue() {

        await this.continueButton.click();
    }


    async cancel() {

        await this.cancelButton.click();
    }


    async verifyErrorMessage(message) {

        await expect(
            this.errorMessage
        ).toContainText(message);
    }
}

module.exports = CheckoutPage;