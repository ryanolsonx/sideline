import { MigrationInterface, QueryRunner } from 'typeorm';

export class Games1750000000000 implements MigrationInterface {
  name = 'Games1750000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "game" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "teamId" uuid NOT NULL REFERENCES "team"("id") ON DELETE CASCADE,
        "roster" jsonb NOT NULL,
        "formation" jsonb NOT NULL,
        "rotationSeed" varchar(64) NOT NULL,
        "startedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query('CREATE INDEX "IDX_game_teamId" ON "game" ("teamId")');
    await queryRunner.query(`
      CREATE TABLE "game_action" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "gameId" uuid NOT NULL REFERENCES "game"("id") ON DELETE CASCADE,
        "sequence" int NOT NULL,
        "kind" varchar(40) NOT NULL,
        "payload" jsonb NOT NULL,
        "recordedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_game_action_gameId_sequence" ON "game_action" ("gameId", "sequence")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "game_action"');
    await queryRunner.query('DROP TABLE "game"');
  }
}
