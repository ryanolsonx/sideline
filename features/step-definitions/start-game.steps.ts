import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';

Given('I manage {string} with these players:', async function (this: SidelineWorld, teamName: string, table: DataTable) {
  const response = await fetch(this.graphqlUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: 'mutation SeedTeam($input: CreateTeamInput!) { createTeam(input: $input) { id } }',
      variables: { input: { name: teamName, players: table.hashes().map((row) => row['player name']) } },
    }),
  });
  if (!response.ok) throw new Error(`Could not seed ${teamName}.`);
});

When('I start a game for {string}', async function (this: SidelineWorld, teamName: string) {
  await this.page.getByRole('article').filter({ has: this.page.getByRole('heading', { name: teamName }) }).getByRole('button', { name: 'Start game' }).click();
});

When('I choose {string}', async function (this: SidelineWorld, format: string) {
  await this.page.getByRole('button', { name: new RegExp(`^${format}`) }).click();
});

When('I mark every player as present', async function (this: SidelineWorld) {
  const boxes = this.page.getByRole('checkbox');
  const count = await boxes.count();
  for (let index = 0; index < count; index++) await boxes.nth(index).check();
});

When('I start the game', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Start game' }).click();
});

Then('I see round {int} of 8', async function (this: SidelineWorld, round: number) {
  await expect(this.page.getByRole('heading', { name: `Round ${round} of 8` })).toBeVisible();
});

Then('I see {int} players playing', async function (this: SidelineWorld, playerCount: number) {
  await expect(this.page.getByLabel('Playing').getByRole('listitem')).toHaveCount(playerCount);
});

Then('I see {int} player out this round', async function (this: SidelineWorld, playerCount: number) {
  await expect(this.page.getByLabel('Out this round').getByRole('listitem')).toHaveCount(playerCount);
});

When('I advance through the remaining rounds', async function (this: SidelineWorld) {
  for (let round = 2; round <= 8; round++) await this.page.getByRole('button', { name: 'Subs →' }).click();
});

Then('I am told the game is complete', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('status')).toHaveText('Game complete — 8 rounds played.');
});
