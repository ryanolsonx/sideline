Feature: Play the first round
  As a coach
  I want the app to pick who starts
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

  Scenario: Beginning the game puts round one on the field
    Given I have started a game for "Salt Lake Strikers"
    When I begin the game
    Then 1 player is in goal
    And 2 players are at defender
    And 2 players are at forward
    And 1 player is out

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
    When I return to the game
    Then round 1 has the lineup it began with
