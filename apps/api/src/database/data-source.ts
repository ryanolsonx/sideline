import { DataSource } from 'typeorm';
import { InitialSchema1710000000000 } from './migrations/1710000000000-initial-schema';
import { TeamRosters1720000000000 } from './migrations/1720000000000-team-rosters';
import { TeamCoachUsernames1730000000000 } from './migrations/1730000000000-team-coach-usernames';
import { TeamFormations1740000000000 } from './migrations/1740000000000-team-formations';
import { Games1750000000000 } from './migrations/1750000000000-games';
import { databaseOptions } from './typeorm.config';

export default new DataSource({
  ...databaseOptions,
  migrations: [
    InitialSchema1710000000000,
    TeamRosters1720000000000,
    TeamCoachUsernames1730000000000,
    TeamFormations1740000000000,
    Games1750000000000,
  ],
});
