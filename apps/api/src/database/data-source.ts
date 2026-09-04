import { DataSource } from 'typeorm';
import { InitialSchema1710000000000 } from './migrations/1710000000000-initial-schema';
import { TeamRosters1720000000000 } from './migrations/1720000000000-team-rosters';
import { GameRounds1730000000000 } from './migrations/1730000000000-game-rounds';
import { databaseOptions } from './typeorm.config';

export default new DataSource({
  ...databaseOptions,
  migrations: [InitialSchema1710000000000, TeamRosters1720000000000, GameRounds1730000000000],
});
