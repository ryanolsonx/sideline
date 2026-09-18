Feature: Rotate the team through the game
  As a coach
  I want the app to pick who plays next
  So that everyone gets a fair share of the game while I watch it

  Background:
    Given I already manage "Salt Lake Strikers" with these players:
      | player name   |
      | Avery Kim     |
      | Jordan Lee    |
      | Sam Rivera    |
      | Taylor Brooks |
      | Casey Morgan  |
      | Riley Chen    |

  Scenario: Calling subs plans the next round
    Given I have started a game for "Salt Lake Strikers"
    And I have begun the game
    And I have used the lineup
    When I call subs
    Then I am shown the plan for round 2
    And nobody who sat out round 1 is out again

  Scenario: Playing through to the last round
    Given I have started a game for "Salt Lake Strikers"
    And I have begun the game
    When I play every round of the game
    Then round 8 is on the field
    And there are no more subs to call
