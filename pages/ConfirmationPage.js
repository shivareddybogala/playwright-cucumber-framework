const { expect } = require('@playwright/test');

class ConfirmationPage {

    constructor(page) {

        this.page = page;

        this.finishButton =
            page.getByRole('button', {
                name: 'Finish'
            });

        this.cancelButton =
            page.getByRole('button', {
                name: 'Cancel'
            });

        this.completeHeader =
            page.getByText(
                'Thank you for your order!',
                { exact: true }
            );

        this.backHomeButton =
            page.getByRole('button', {
                name: 'Back Home'
            });
    }


    async finishOrder() {

        await this.finishButton.click();
    }


    async verifyOrderCompleted() {

        await expect(
            this.completeHeader
        ).toBeVisible();
    }


    async backHome() {

        await this.backHomeButton.click();
    }
}

module.exports = ConfirmationPage;