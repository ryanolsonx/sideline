Feature: Start and run a game
  As a coach
  I want to start a game from my team roster and advance the substitutions
  So that I always know who is playing and who is out

  Scenario: Start a six-on-six game and finish eight rounds
    Given I manage "Salt Lake Strikers" with these players:
      | player name   |
      | Avery Kim     |
      | Jordan Lee    |
      | Sam Rivera    |
      | Taylor Brooks |
      | Casey Morgan  |
      | Riley Chen    |
      | Morgan Park   |
    When I open the home page
    And I start a game for "Salt Lake Strikers"
    And I choose "6 on 6"
    And I mark every player as present
    And I start the game
    Then I see round 1 of 8
    And I see 6 players playing
    And I see 1 player out this round
    When I advance through the remaining rounds
    Then I see round 8 of 8
    And I am told the game is complete
