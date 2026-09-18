import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';

const NOBODY = 'Nobody';
const roundsInAGame = 8;

async function playersOut(world: SidelineWorld): Promise<string[]> {
  const names = await world.page.getByRole('list', { name: 'Out' }).getByRole('listitem').allInnerTexts();
  return names.map((name) => name.trim()).filter((name) => name !== NOBODY);
}

When('I call subs', async function (this: SidelineWorld) {
  this.playersOutLastRound = await playersOut(this);
  await this.page.getByRole('button', { name: 'Subs' }).click();
  await expect(this.page.getByText('Planned', { exact: true })).toBeVisible();
});

Then('nobody who sat out round {int} is out again', async function (this: SidelineWorld, round: number) {
  const satBefore = this.playersOutLastRound ?? [];
  if (satBefore.length === 0) throw new Error(`Nobody was out in round ${round}.`);

  expect(await playersOut(this)).not.toEqual(expect.arrayContaining(satBefore));
});

When('I play every round of the game', async function (this: SidelineWorld) {
  for (let round = 1; round <= roundsInAGame; round += 1) {
    await expect(this.page.getByRole('heading', { level: 1, name: `Round ${round}` })).toBeVisible();
    await this.page.getByRole('button', { name: 'Use Lineup' }).click();
    await expect(this.page.getByText('On the field', { exact: true })).toBeVisible();

    if (round < roundsInAGame) {
      await this.page.getByRole('button', { name: 'Subs' }).click();
      await expect(this.page.getByText('Planned', { exact: true })).toBeVisible();
    }
  }
});

Then('there are no more subs to call', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('button', { name: 'Subs' })).toHaveCount(0);
});
