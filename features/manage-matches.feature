Feature: Manage matches
  As a league organizer
  I want to record a match
  So that it appears in the saved matches list

  Scenario: Create a match
    Given I am viewing the matches page
    When I create a match named "BDD acceptance match"
    Then the saved matches should include "BDD acceptance match"
