import { MigrationInterface, QueryRunner } from 'typeorm';

/** The `match` table backed the disposable example module that `games` replaced. */
export class DropMatchExample1760000000000 implements MigrationInterface {
  name = 'DropMatchExample1760000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "match"');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "match" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(120) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
  }
}
