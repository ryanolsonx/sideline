import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SidelineWorld } from '../support/world';

const appUrl = 'http://127.0.0.1:4173';
const defaultCoachUsername = 'test coach';

async function continueAsCoach(world: SidelineWorld, username: string): Promise<void> {
  await world.context.addCookies([
    {
      name: 'sidelineCoachUsername',
      value: username,
      url: appUrl,
    },
  ]);
}

async function seedTeam(
  world: SidelineWorld,
  coachUsername: string,
  teamName: string,
): Promise<void> {
  const response = await fetch(world.graphqlUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `sidelineCoachUsername=${encodeURIComponent(coachUsername)}`,
    },
    body: JSON.stringify({
      query: 'mutation SeedTeam($input: CreateTeamInput!) { createTeam(input: $input) { id } }',
      variables: { input: { name: teamName, players: ['Avery'] } },
    }),
  });
  if (!response.ok) throw new Error(`Could not seed ${teamName}.`);
}

Given('I am a coach with no teams', async function (this: SidelineWorld) {
  await this.context.addInitScript(() => window.localStorage.clear());
  await continueAsCoach(this, defaultCoachUsername);
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

When('I add these players:', async function (this: SidelineWorld, table: DataTable) {
  for (const row of table.hashes()) {
    await this.page.getByLabel('Player name').fill(row['player name']);
    await this.page.getByRole('button', { name: 'Add' }).click();
  }
});

Then('each player appears in the order added', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('listitem').locator('.player-name')).toHaveText([
    'Avery Kim',
    'Jordan Lee',
    'Sam Rivera',
    'Taylor Brooks',
    'Casey Morgan',
    'Riley Chen',
  ]);
});

Then('the roster count is {int} players', async function (this: SidelineWorld, expectedCount: number) {
  await expect(this.page.getByText(`${expectedCount} players`)).toBeVisible();
});

Given('I am adding players to {string}', async function (this: SidelineWorld, teamName: string) {
  await continueAsCoach(this, defaultCoachUsername);
  await this.page.goto(appUrl);
  await this.page.getByLabel('Team name').fill(teamName);
  await this.page.getByRole('button', { name: 'Add players' }).click();
});

Given('the roster is empty', async function (this: SidelineWorld) {
  await expect(this.page.getByText('0 players')).toBeVisible();
});

Then('I cannot finish setup', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('button', { name: 'Finish setup' })).toBeDisabled();
});

When('I finish setup', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Finish setup' }).click();
});

When('I continue to formation', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Choose formation' }).click();
});

Then('I can choose a supported 5v5 formation', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('heading', { name: 'Choose your formation.' })).toBeVisible();
  await expect(this.page.getByLabel('5v5: 2 defenders, 2 forwards')).toBeVisible();
  await expect(this.page.getByLabel('5v5: 1 defender, 3 forwards')).toBeVisible();
});

When(
  'I choose the 5v5 formation with 1 defender and 3 forwards',
  async function (this: SidelineWorld) {
    await this.page.getByLabel('5v5: 1 defender, 3 forwards').check();
  },
);

Then('{string} appears under {string}', async function (this: SidelineWorld, teamName: string, heading: string) {
  const section = this.page.getByRole('region', { name: heading });
  await expect(section.getByRole('heading', { name: teamName })).toBeVisible();
});

Then('the team has {int} players', async function (this: SidelineWorld, playerCount: number) {
  await expect(this.page.getByText(`${playerCount} players`)).toBeVisible();
});

Given('I already manage {string}', async function (this: SidelineWorld, teamName: string) {
  await continueAsCoach(this, defaultCoachUsername);
  await seedTeam(this, defaultCoachUsername, teamName);
});

When('I choose to add another team', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Add team' }).click();
});

Then('I can name a new team', async function (this: SidelineWorld) {
  await expect(this.page.getByLabel('Team name')).toBeVisible();
});

Then('{string} remains one of my teams', async function (this: SidelineWorld, teamName: string) {
  await expect(this.page.getByText(`Already managing: ${teamName}`)).toBeVisible();
});

When('I open {string}', async function (this: SidelineWorld, teamName: string) {
  await this.page.getByRole('button', { name: new RegExp(teamName) }).click();
});

When('I replace {string} with {string}', async function (this: SidelineWorld, oldName: string, newName: string) {
  await this.page.getByRole('button', { name: `Remove ${oldName}` }).click();
  await this.page.getByLabel('Player name').fill(newName);
  await this.page.getByRole('button', { name: 'Add player' }).click();
});

When('I save the team', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Save team' }).click();
});

Given('I have not chosen a coach username', async function (this: SidelineWorld) {
  await this.context.clearCookies();
});

When('I open Sideline', async function (this: SidelineWorld) {
  await this.page.goto(appUrl);
});

Then('I am asked for my coach username', async function (this: SidelineWorld) {
  await expect(this.page.getByRole('heading', { name: 'Who is coaching today?' })).toBeVisible();
  await expect(this.page.getByLabel('Coach username')).toBeVisible();
});

When('I continue as {string}', async function (this: SidelineWorld, username: string) {
  if (this.page.url() === 'about:blank') await this.page.goto(appUrl);
  await this.page.getByLabel('Coach username').fill(username);
  await this.page.getByRole('button', { name: 'Continue' }).click();
});

Then(
  'I see {string} as the current coach',
  async function (this: SidelineWorld, username: string) {
    await expect(this.page.getByText(username, { exact: true })).toBeVisible();
  },
);

Given(
  '{string} manages {string}',
  async function (this: SidelineWorld, coachUsername: string, teamName: string) {
    await seedTeam(this, coachUsername, teamName);
  },
);

Then('{string} does not appear', async function (this: SidelineWorld, text: string) {
  await expect(this.page.getByText(text, { exact: true })).toHaveCount(0);
});

Given(
  'I previously continued as {string}',
  async function (this: SidelineWorld, username: string) {
    await continueAsCoach(this, username);
  },
);

When('I return to Sideline', async function (this: SidelineWorld) {
  await this.page.goto(appUrl);
});

When('I sign out', async function (this: SidelineWorld) {
  await this.page.getByRole('button', { name: 'Sign out' }).click();
});
