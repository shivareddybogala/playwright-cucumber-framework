Feature: Product Management

  Background:
    Given I am logged in with valid credentials

  @smoke
  Scenario: Verify products are displayed

    Then I should see the products page

    And I should see products displayed


  @regression
  Scenario: Verify product count

    Then I should see the products page

    And I should see 6 products


  @regression
  Scenario: Add a product from products page

    When I add "Sauce Labs Backpack" to the cart

    Then the cart should contain 1 item


  @regression
  Scenario: Add multiple products

    When I add "Sauce Labs Backpack" to the cart

    And I add "Sauce Labs Bike Light" to the cart

    Then the cart should contain 2 items


  @regression
  Scenario: Remove product from products page

    When I add "Sauce Labs Backpack" to the cart

    And I remove "Sauce Labs Backpack" from the products page

    Then the cart should be empty


  @regression
  Scenario: Sort products by price low to high

    When I sort products by "Price (low to high)"

    Then products should be sorted by price low to high