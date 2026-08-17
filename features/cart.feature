Feature: Shopping Cart

  Background:
    Given I am logged in with valid credentials


  @smoke
  Scenario: Add product and verify cart

    When I add "Sauce Labs Backpack" to the cart

    And I open the shopping cart

    Then I should see "Sauce Labs Backpack" in the cart


  @regression
  Scenario: Add multiple products and verify cart

    When I add "Sauce Labs Backpack" to the cart

    And I add "Sauce Labs Bike Light" to the cart

    And I open the shopping cart

    Then I should see "Sauce Labs Backpack" in the cart

    And I should see "Sauce Labs Bike Light" in the cart


  @regression
  Scenario: Remove product from cart

    When I add "Sauce Labs Backpack" to the cart

    And I open the shopping cart

    When I remove "Sauce Labs Backpack" from the cart

    Then the cart should be empty


  @regression
  Scenario: Continue shopping from cart

    When I add "Sauce Labs Backpack" to the cart

    And I open the shopping cart

    When I continue shopping

    Then I should see the products page