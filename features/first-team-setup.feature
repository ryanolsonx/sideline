Feature: Set up a first team
  As a coach
  I want to add my team and its players
  So that I can begin managing the team in Sideline

  Scenario: A first-time coach is invited to add a team
    Given I am a coach with no teams
    When I open the home page
    Then I am invited to add my first team
