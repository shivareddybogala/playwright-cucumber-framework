Feature: Checkout

  Background:
    Given I am logged in with valid credentials

    And I add "Sauce Labs Backpack" to the cart

    And I open the shopping cart


  @smoke
  Scenario: Successfully complete checkout

    When I checkout

    Then I should see the checkout information page

    When I enter valid customer information

    And I continue checkout

    And I complete the order

    Then I should see the order confirmation


  @regression
  Scenario: Checkout validation without customer information

    When I checkout

    Then I should see the checkout information page

    When I continue checkout

    Then I should see the checkout error message