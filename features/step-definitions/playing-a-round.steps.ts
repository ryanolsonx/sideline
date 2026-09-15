import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';

const NOBODY = 'Nobody';

function positionList(world: SidelineWorld, listName: string) {
  return world.page.getByRole('list', { name: listName });
}

async function playersAt(world: SidelineWorld, listName: string): Promise<string[]> {
  const names = await positionList(world, listName).getByRole('listitem').allInnerTexts();
  return names.map((name) => name.trim()).filter((name) => name !== NOBODY);
}

Then('{int} player(s) is/are in goal', async function (this: SidelineWorld, count: number) {
  expect(await playersAt(this, 'Goalie')).toHaveLength(count);
});

Then('{int} player(s) is/are at defender', async function (this: SidelineWorld, count: number) {
  expect(await playersAt(this, 'Defenders')).toHaveLength(count);
});

Then('{int} player(s) is/are at forward', async function (this: SidelineWorld, count: number) {
  expect(await playersAt(this, 'Forwards')).toHaveLength(count);
});

Then('{int} player(s) is/are out', async function (this: SidelineWorld, count: number) {
  expect(await playersAt(this, 'Out')).toHaveLength(count);
});

Then('nobody is out', async function (this: SidelineWorld) {
  await expect(this.page.getByText('Everyone here is playing this round.')).toBeVisible();
});

Then('{int} place(s) on the field is/are empty', async function (this: SidelineWorld, count: number) {
  await expect(this.page.getByText(NOBODY, { exact: true })).toHaveCount(count);
});

Then('round {int} has the lineup it began with', async function (this: SidelineWorld, round: number) {
  await expect(this.page.getByRole('heading', { level: 1, name: `Round ${round}` })).toBeVisible();
  const onField = [
    ...await playersAt(this, 'Goalie'),
    ...await playersAt(this, 'Defenders'),
    ...await playersAt(this, 'Forwards'),
  ];

  expect(onField).toEqual(this.roundOneLineup);
});
