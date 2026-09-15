Feature: Start a game
  As a coach
  I want to start a game and mark who turned up
  So that the game is fixed to the team it began with and to who is playing

  Background:
    Given I already manage "Salt Lake Strikers" with these players:
      | player name   |
      | Avery Kim     |
      | Jordan Lee    |
      | Sam Rivera    |
      | Taylor Brooks |
      | Casey Morgan  |
      | Riley Chen    |

  Scenario: Start a game from the team screen
    When I open the home page
    And I open "Salt Lake Strikers"
    Then I am invited to start a game
    When I start a game
    Then I am asked who is here
    And every player on the roster is marked present

  Scenario: Confirm who turned up
    Given I have started a game for "Salt Lake Strikers"
    When I mark "Riley Chen" as absent
    And I confirm who is here
    Then the game is waiting to begin
    When I return to the game
    Then "Riley Chen" is marked absent
    And every other player is marked present

  Scenario: A game keeps the roster it began with
    Given I have started a game for "Salt Lake Strikers"
    And I have confirmed who is here
    When I replace "Avery Kim" with "Morgan Park" on the team
    And I return to the game
    Then "Avery Kim" is still part of the game
    And "Morgan Park" is not part of the game
