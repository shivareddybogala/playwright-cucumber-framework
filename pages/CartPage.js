const { expect } = require('@playwright/test');

class CartPage {

    constructor(page) {

        this.page = page;

        this.cartTitle = page.getByText('Your Cart', {
            exact: true
        });

        this.cartItems = page.locator(
            '.cart_item'
        );

        this.checkoutButton =
            page.getByRole('button', {
                name: 'Checkout'
            });

        this.continueShoppingButton =
            page.getByRole('button', {
                name: 'Continue Shopping'
            });
    }


    async verifyCartPage() {

        await expect(
            this.cartTitle
        ).toBeVisible();
    }


    async verifyProductInCart(productName) {

        const product =
            this.cartItems.filter({
                hasText: productName
            });

        await expect(product).toBeVisible();
    }


    async getCartItemCount() {

        return await this.cartItems.count();
    }


    async removeProduct(productName) {

        const product =
            this.cartItems.filter({
                hasText: productName
            });

        await product.getByRole('button', {
            name: /Remove/i
        }).click();
    }


    async checkout() {

        await this.checkoutButton.click();
    }


    async continueShopping() {

        await this.continueShoppingButton.click();
    }


    async verifyCartIsEmpty() {

        await expect(
            this.cartItems
        ).toHaveCount(0);
    }
}

module.exports = CartPage;