import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const databaseOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'sideline',
  password: process.env.DATABASE_PASSWORD ?? 'sideline',
  database: process.env.DATABASE_NAME ?? 'sideline',
};
