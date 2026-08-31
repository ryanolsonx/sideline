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
