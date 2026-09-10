Feature: Use Sideline as a coach
  As a youth soccer coach
  I want Sideline to remember my username
  So that I see the teams I manage

  Scenario: Choose a username on the first visit
    Given I have not chosen a coach username
    When I open Sideline
    Then I am asked for my coach username
    When I continue as "  Casey   Morgan "
    Then I am invited to add my first team
