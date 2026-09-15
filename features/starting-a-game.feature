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
    And I begin the game
    And I return to the game
    Then "Riley Chen" is not part of round 1
    And every other player is part of round 1

  Scenario: A game keeps the roster it began with
    Given I have started a game for "Salt Lake Strikers"
    And I have begun the game
    When I replace "Avery Kim" with "Morgan Park" on the team
    And I return to the game
    Then "Avery Kim" is still part of the game
    And "Morgan Park" is not part of the game

  Scenario: A game belongs to the coach whose team it is
    Given another coach has started a game
    When I open that game
    Then I am told it is not my game
