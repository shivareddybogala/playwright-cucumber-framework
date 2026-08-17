Feature: Customer Login and Shopping

  @smoke
  Scenario: Customer successfully logs into the application

    Given I am on the login page

    When I login with valid credentials

    Then I should see the products page


  @regression
  Scenario: Customer cannot login with invalid credentials

    Given I am on the login page

    When I login with invalid credentials

    Then I should see a login error message


  @regression
  Scenario: Locked user cannot login

    Given I am on the login page

    When I login with locked user credentials

    Then I should see a locked user error message


  @smoke @regression
  Scenario: Customer adds a product to the shopping cart

    Given I am on the login page

    When I login with valid credentials

    Then I should see the products page

    When I add "Sauce Labs Backpack" to the cart

    And I open the shopping cart

    Then I should see "Sauce Labs Backpack" in the cart


  @regression
  Scenario: Customer removes a product from the shopping cart

    Given I am on the login page

    When I login with valid credentials

    Then I should see the products page

    When I add "Sauce Labs Backpack" to the cart

    And I open the shopping cart

    Then I should see "Sauce Labs Backpack" in the cart

    When I remove "Sauce Labs Backpack" from the cart

    Then the cart should be empty


  @smoke
  Scenario: Customer logs out successfully

    Given I am on the login page

    When I login with valid credentials

    Then I should see the products page

    When I logout from the application

    Then I should return to the login page