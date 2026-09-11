Feature: Manage a team
  Scenario: Update a team roster
    Given I already manage "Salt Lake Strikers"
    When I open the home page
    And I open "Salt Lake Strikers"
    And I replace "Avery" with "Morgan Park"
    And I save the team
    And I open "Salt Lake Strikers"
    Then "Morgan Park" appears in the roster
    And "Avery" does not appear

  Scenario: Rename a team
    Given I already manage "Salt Lake Strikers"
    When I open the home page
    And I open "Salt Lake Strikers"
    And I change its name to "Salt Lake Comets"
    And I save changes
    Then "Salt Lake Comets" appears under "Your teams"

  Scenario: Open a team from its URL
    Given I already manage "Salt Lake Strikers"
    When I open the team URL
    Then I see the "Salt Lake Strikers" team settings
