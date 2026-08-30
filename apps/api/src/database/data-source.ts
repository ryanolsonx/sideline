import { DataSource } from 'typeorm';
import { databaseOptions } from './typeorm.config';

export default new DataSource({
  ...databaseOptions,
  migrations: [],
});
