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
