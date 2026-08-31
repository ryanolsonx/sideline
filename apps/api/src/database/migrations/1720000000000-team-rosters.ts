import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamRosters1720000000000 implements MigrationInterface {
  name = 'TeamRosters1720000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "team" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(80) NOT NULL,
        "createdAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "player" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(80) NOT NULL,
        "teamId" uuid NOT NULL REFERENCES "team"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query('CREATE INDEX "IDX_player_teamId" ON "player" ("teamId")');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "player"');
    await queryRunner.query('DROP TABLE "team"');
  }
}
