import { DataSource } from 'typeorm';
import { InitialSchema1710000000000 } from './migrations/1710000000000-initial-schema';
import { databaseOptions } from './typeorm.config';

export default new DataSource({
  ...databaseOptions,
  migrations: [InitialSchema1710000000000],
});
