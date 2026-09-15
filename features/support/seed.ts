import { SidelineWorld } from './world';

export const appUrl = process.env.BDD_BASE_URL ?? 'http://127.0.0.1:4173';
export const defaultCoachUsername = 'test coach';

export async function continueAsCoach(world: SidelineWorld, username: string): Promise<void> {
  await world.context.addCookies([
    {
      name: 'sidelineCoachUsername',
      value: username,
      url: appUrl,
    },
  ]);
}

export async function seedTeam(
  world: SidelineWorld,
  coachUsername: string,
  teamName: string,
  playerNames: string[] = ['Avery'],
): Promise<string> {
  const response = await fetch(world.graphqlUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `sidelineCoachUsername=${encodeURIComponent(coachUsername)}`,
    },
    body: JSON.stringify({
      query: 'mutation SeedTeam($input: CreateTeamInput!) { createTeam(input: $input) { id } }',
      variables: {
        input: {
          name: teamName,
          players: playerNames,
          formation: { defender: 2, forward: 2 },
        },
      },
    }),
  });
  if (!response.ok) throw new Error(`Could not seed ${teamName}.`);
  const result = await response.json() as { data?: { createTeam?: { id?: string } } };
  const id = result.data?.createTeam?.id;
  if (!id) throw new Error(`Could not read the id for ${teamName}.`);
  return id;
}
