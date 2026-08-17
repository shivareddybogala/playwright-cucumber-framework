const { expect } = require('@playwright/test');

class ProductsPage {

    constructor(page) {

        this.page = page;

        // Page locators
        this.productsTitle = page.getByText('Products', {
            exact: true
        });

        this.inventoryItems = page.locator(
            '.inventory_item'
        );

        this.productNames = page.locator(
            '.inventory_item_name'
        );

        this.productPrices = page.locator(
            '.inventory_item_price'
        );

        this.cartLink = page.locator(
            '.shopping_cart_link'
        );

        this.cartBadge = page.locator(
            '.shopping_cart_badge'
        );

        this.sortDropdown = page.locator(
            '.product_sort_container'
        );

        this.menuButton = page.getByRole('button', {
            name: 'Open Menu'
        });

        this.logoutLink = page.getByText('Logout', {
            exact: true
        });
    }


    async verifyProductsPage() {

        await expect(
            this.productsTitle
        ).toBeVisible();
    }


    async verifyProductsDisplayed() {

        await expect(
            this.inventoryItems.first()
        ).toBeVisible();
    }


    async getProductCount() {

        return await this.inventoryItems.count();
    }


    async addProduct(productName) {

        const product = this.inventoryItems.filter({
            hasText: productName
        });

        await product.getByRole('button', {
            name: /Add to cart/i
        }).click();
    }


    async removeProduct(productName) {

        const product = this.inventoryItems.filter({
            hasText: productName
        });

        await product.getByRole('button', {
            name: /Remove/i
        }).click();
    }


    async verifyCartCount(count) {

        await expect(
            this.cartBadge
        ).toHaveText(String(count));
    }


    async openCart() {

        await this.cartLink.click();
    }


    async sortProducts(sortOption) {

        await this.sortDropdown.selectOption(
            sortOption
        );
    }


    async verifyProductOrder(expectedProducts) {

        const actualProducts =
            await this.productNames.allTextContents();

        expect(actualProducts)
            .toEqual(expectedProducts);
    }


    async logout() {

        await this.menuButton.click();

        await this.logoutLink.click();
    }
}

module.exports = ProductsPage;