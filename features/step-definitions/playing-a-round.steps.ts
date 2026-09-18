import { Given, Then, When } from '@cucumber/cucumber';
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

Then('I am shown the plan for round {int}', async function (this: SidelineWorld, round: number) {
  await expect(this.page.getByRole('heading', { level: 1, name: `Round ${round}` })).toBeVisible();
  await expect(this.page.getByText('Planned', { exact: true })).toBeVisible();
});

Then('round {int} is not on the field yet', async function (this: SidelineWorld, round: number) {
  await expect(this.page.getByRole('heading', { level: 1, name: `Round ${round}` })).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Use Lineup' })).toBeVisible();
  await expect(this.page.getByText('On the field', { exact: true })).toHaveCount(0);
});

When('I use the lineup', async function (this: SidelineWorld) {
  this.roundOneLineup = await Promise.all(
    ['Goalie', 'Defenders', 'Forwards'].map((listName) =>
      positionList(this, listName).getByRole('listitem').allInnerTexts()),
  ).then((lists) => lists.flat().map((name) => name.trim()).filter((name) => name !== NOBODY));

  await this.page.getByRole('button', { name: 'Use Lineup' }).click();
  await expect(this.page.getByText('On the field', { exact: true })).toBeVisible();
});

Given('I have used the lineup', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Use Lineup' }).click();
  await expect(this.page.getByText('On the field', { exact: true })).toBeVisible();
});

Then('round {int} is on the field', async function (this: SidelineWorld, round: number) {
  await expect(this.page.getByRole('heading', { level: 1, name: `Round ${round}` })).toBeVisible();
  await expect(this.page.getByText('On the field', { exact: true })).toBeVisible();
});

Then('round {int} has the lineup I used', async function (this: SidelineWorld, round: number) {
  await expect(this.page.getByRole('heading', { level: 1, name: `Round ${round}` })).toBeVisible();
  expect([
    ...await playersAt(this, 'Goalie'),
    ...await playersAt(this, 'Defenders'),
    ...await playersAt(this, 'Forwards'),
  ]).toEqual(this.roundOneLineup);
});

When('I swap the player in goal with the player who is out', async function (this: SidelineWorld) {
  const [inGoal] = await playersAt(this, 'Goalie');
  const [wasOut] = await playersAt(this, 'Out');
  this.swappedPlayerNames = { fromGoal: inGoal, fromOut: wasOut };

  await positionList(this, 'Goalie').getByRole('button', { name: inGoal }).click();
  await positionList(this, 'Out').getByRole('button', { name: wasOut }).click();
});

Then('the swapped players have traded places', async function (this: SidelineWorld) {
  const swap = this.swappedPlayerNames;
  if (!swap) throw new Error('No players have been swapped in this scenario.');

  await expect(positionList(this, 'Goalie').getByText(swap.fromOut, { exact: true })).toBeVisible();
  await expect(positionList(this, 'Out').getByText(swap.fromGoal, { exact: true })).toBeVisible();
});
