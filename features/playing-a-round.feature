Feature: Play the first round
  As a coach
  I want the app to pick who starts and to see it before it counts
  So that I am not choosing a lineup while the game kicks off

  Background:
    Given I already manage "Salt Lake Strikers" with these players:
      | player name   |
      | Avery Kim     |
      | Jordan Lee    |
      | Sam Rivera    |
      | Taylor Brooks |
      | Casey Morgan  |
      | Riley Chen    |

  Scenario: Beginning the game plans round one
    Given I have started a game for "Salt Lake Strikers"
    When I begin the game
    Then I am shown the plan for round 1
    And 1 player is in goal
    And 2 players are at defender
    And 2 players are at forward
    And 1 player is out
    And round 1 is not on the field yet

  Scenario: Using the lineup puts round one on the field
    Given I have started a game for "Salt Lake Strikers"
    And I have begun the game
    When I use the lineup
    Then round 1 is on the field
    And round 1 has the lineup I used

  Scenario: Swapping two players before the round starts
    Given I have started a game for "Salt Lake Strikers"
    And I have begun the game
    When I swap the player in goal with the player who is out
    Then the swapped players have traded places
    When I return to the game
    Then the swapped players have traded places
    When I use the lineup
    And I return to the game
    Then the swapped players have traded places

  Scenario: A short-handed side plays rather than being refused
    Given I have started a game for "Salt Lake Strikers"
    When I mark "Riley Chen" as absent
    And I mark "Casey Morgan" as absent
    And I begin the game
    Then 1 player is in goal
    And 2 players are at defender
    And 1 player is at forward
    And 1 place on the field is empty
    And nobody is out

  Scenario: A round keeps the lineup it began with
    Given I have started a game for "Salt Lake Strikers"
    And I have begun the game
    And I have used the lineup
    When I return to the game
    Then round 1 has the lineup it began with
