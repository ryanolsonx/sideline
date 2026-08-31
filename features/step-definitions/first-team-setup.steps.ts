import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';

Given('I am a coach with no teams', async function (this: SidelineWorld) {
  await this.context.addInitScript(() => window.localStorage.clear());
});

When('I open the home page', async function (this: SidelineWorld) {
  await this.page.goto('http://127.0.0.1:4173');
});

Then('I am invited to add my first team', async function (this: SidelineWorld) {
  await expect(
    this.page.getByRole('heading', { name: "Welcome to Sideline. Let's add your team." }),
  ).toBeVisible();
});

When('I name the team {string}', async function (this: SidelineWorld, teamName: string) {
  await this.page.getByLabel('Team name').fill(teamName);
});

When('I continue to the roster', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Add players' }).click();
});

Then("I am asked to add the team's players", async function (this: SidelineWorld) {
  await expect(this.page.getByRole('heading', { name: 'Add your players.' })).toBeVisible();
  await expect(this.page.getByText('Salt Lake Strikers')).toBeVisible();
});

When('I add {string} to the roster', async function (this: SidelineWorld, playerName: string) {
  await this.page.getByLabel('Player name').fill(playerName);
  await this.page.getByRole('button', { name: 'Add' }).click();
});

Then('{string} appears in the roster', async function (this: SidelineWorld, playerName: string) {
  await expect(this.page.getByRole('listitem').getByText(playerName)).toBeVisible();
});
