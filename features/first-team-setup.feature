Feature: Set up a first team
  As a coach
  I want to add my team and its players
  So that I can begin managing the team in Sideline

  Scenario: A first-time coach is invited to add a team
    Given I am a coach with no teams
    When I open the home page
    Then I am invited to add my first team
    When I name the team "Salt Lake Strikers"
    And I continue to the roster
    Then I am asked to add the team's players
    When I add "Avery Kim" to the roster
    Then "Avery Kim" appears in the roster
    When I add these players:
      | player name   |
      | Jordan Lee    |
      | Sam Rivera    |
      | Taylor Brooks |
      | Casey Morgan  |
      | Riley Chen    |
    Then each player appears in the order added
    And the roster count is 6 players

  Scenario: A coach cannot finish without a player
    Given I am adding players to "Salt Lake Strikers"
    And the roster is empty
    Then I cannot finish setup
