import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';

Given('I am viewing the matches page', async function (this: SidelineWorld) {
  await this.currentPage.goto(this.baseUrl);
  await expect(this.currentPage.getByRole('heading', { name: 'Matches, end to end.' })).toBeVisible();
  await expect(this.currentPage.getByText('Loading…')).toBeHidden();
});

When('I create a match named {string}', async function (this: SidelineWorld, matchName: string) {
  const matchingMatches = this.currentPage.getByRole('listitem').filter({ hasText: matchName });
  this.matchingMatchesBeforeSave = await matchingMatches.count();

  await this.currentPage.getByLabel('Match name').fill(matchName);
  await this.currentPage.getByRole('button', { name: 'Save match' }).click();
});

Then(
  'the saved matches should include {string}',
  async function (this: SidelineWorld, matchName: string) {
    const matchingMatches = this.currentPage.getByRole('listitem').filter({ hasText: matchName });
    await expect(matchingMatches).toHaveCount(this.matchingMatchesBeforeSave + 1);
  },
);
