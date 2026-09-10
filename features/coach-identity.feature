Feature: Use Sideline as a coach
  As a youth soccer coach
  I want Sideline to remember my username
  So that I see the teams I manage

  Scenario: Choose a username on the first visit
    Given I have not chosen a coach username
    When I open Sideline
    Then I am asked for my coach username
    When I continue as "  Casey   Morgan "
    Then I see "casey morgan" as the current coach
    And I am invited to add my first team

  Scenario: A coach sees only their teams
    Given "river coach" manages "Salt Lake Strikers"
    And "hill coach" manages "Mountain United"
    When I continue as " River Coach "
    Then "Salt Lake Strikers" appears under "Your teams"
    And "Mountain United" does not appear
