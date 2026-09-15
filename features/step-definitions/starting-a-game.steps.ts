import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';
import { appUrl, continueAsCoach, defaultCoachUsername, seedTeam } from '../support/seed';

function playerCheckbox(world: SidelineWorld, playerName: string) {
  return world.page.getByRole('checkbox', { name: playerName });
}

Given(
  'I already manage {string} with these players:',
  async function (this: SidelineWorld, teamName: string, table: DataTable) {
    this.rosterPlayerNames = table.rows().map(([playerName]) => playerName);
    await continueAsCoach(this, defaultCoachUsername);
    this.teamId = await seedTeam(this, defaultCoachUsername, teamName, this.rosterPlayerNames);
  },
);

Then('I am invited to start a game', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('button', { name: 'Start a game' })).toBeVisible();
});

When('I start a game', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Start a game' }).click();
});

Then('I am asked who is here', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('heading', { name: "Who's here?" })).toBeVisible();
});

Then('every player on the roster is marked present', async function (this: SidelineWorld) {
  for (const playerName of this.rosterPlayerNames) {
    await expect(playerCheckbox(this, playerName)).toBeChecked();
  }
});

Given('I have started a game for {string}', async function (this: SidelineWorld, teamName: string) {
  await this.page.goto(appUrl);
  await this.page.getByRole('button', { name: new RegExp(teamName) }).click();
  await this.page.getByRole('button', { name: 'Start a game' }).click();
  await expect(this.page.getByRole('heading', { name: "Who's here?" })).toBeVisible();
});

When('I mark {string} as absent', async function (this: SidelineWorld, playerName: string) {
  this.absentPlayerNames = [...this.absentPlayerNames, playerName];
  await playerCheckbox(this, playerName).uncheck();
});

When('I confirm who is here', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: "Confirm who's here" }).click();
});

Then('the game is waiting to begin', async function (this: SidelineWorld) {
  await expect(this.page.getByText('This game is waiting to begin')).toBeVisible();
});

Then('{string} is marked absent', async function (this: SidelineWorld, playerName: string) {
  await expect(playerCheckbox(this, playerName)).not.toBeChecked();
});

Then('every other player is marked present', async function (this: SidelineWorld) {
  const present = this.rosterPlayerNames.filter((name) => !this.absentPlayerNames.includes(name));
  for (const playerName of present) {
    await expect(playerCheckbox(this, playerName)).toBeChecked();
  }
});
