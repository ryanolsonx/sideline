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
  this.gameUrl = this.page.url();
});

When('I mark {string} as absent', async function (this: SidelineWorld, playerName: string) {
  this.absentPlayerNames = [...this.absentPlayerNames, playerName];
  await playerCheckbox(this, playerName).uncheck();
});

When(
  'I replace {string} with {string} on the team',
  async function (this: SidelineWorld, oldName: string, newName: string) {
    if (!this.teamId) throw new Error('No team has been created for this scenario.');
    await this.page.goto(`${appUrl}/teams/${this.teamId}`);
    await this.page.getByRole('button', { name: 'Team settings' }).click();
    await this.page.getByRole('button', { name: `Remove ${oldName}` }).click();
    await this.page.getByLabel('Add a player').fill(newName);
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.getByRole('button', { name: 'Save changes' }).click();
    await expect(this.page.getByRole('button', { name: 'Start a game' })).toBeVisible();
  },
);

When('I return to the game', async function (this: SidelineWorld) {
  if (!this.gameUrl) throw new Error('No game has been started for this scenario.');
  await this.page.goto(this.gameUrl);
});

Then('{string} is still part of the game', async function (this: SidelineWorld, playerName: string) {
  await expect(this.page.getByText(playerName, { exact: true })).toBeVisible();
});

Then('{string} is not part of the game', async function (this: SidelineWorld, playerName: string) {
  await expect(this.page.getByText(playerName, { exact: true })).toHaveCount(0);
});

When('I begin the game', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Begin' }).click();
  await expect(this.page.getByRole('heading', { level: 1, name: 'Round 1' })).toBeVisible();
});

Given('I have begun the game', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Begin' }).click();
  await expect(this.page.getByRole('heading', { level: 1, name: 'Round 1' })).toBeVisible();
  this.roundOneLineup = await Promise.all(
    ['Goalie', 'Defenders', 'Forwards'].map((listName) =>
      this.page.getByRole('list', { name: listName }).getByRole('listitem').allInnerTexts()),
  ).then((lists) => lists.flat().map((name) => name.trim()).filter((name) => name !== 'Nobody'));
});

Then('{string} is not part of round 1', async function (this: SidelineWorld, playerName: string) {
  await expect(this.page.getByText(playerName, { exact: true })).toHaveCount(0);
});

Then('every other player is part of round 1', async function (this: SidelineWorld) {
  const here = this.rosterPlayerNames.filter((name) => !this.absentPlayerNames.includes(name));
  for (const playerName of here) {
    await expect(this.page.getByText(playerName, { exact: true })).toBeVisible();
  }
});
