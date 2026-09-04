import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameRounds1730000000000 implements MigrationInterface {
  name = 'GameRounds1730000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "game" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "teamId" uuid NOT NULL REFERENCES "team"("id") ON DELETE CASCADE,
        "fieldSize" smallint NOT NULL CHECK ("fieldSize" IN (5, 6)),
        "status" varchar(16) NOT NULL DEFAULT 'ACTIVE',
        "currentRound" smallint NOT NULL DEFAULT 1,
        "startedAt" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "game_round" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "gameId" uuid NOT NULL REFERENCES "game"("id") ON DELETE CASCADE,
        "number" smallint NOT NULL,
        UNIQUE ("gameId", "number")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "game_round_assignment" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "roundId" uuid NOT NULL REFERENCES "game_round"("id") ON DELETE CASCADE,
        "playerId" uuid NOT NULL REFERENCES "player"("id") ON DELETE CASCADE,
        "status" varchar(16) NOT NULL CHECK ("status" IN ('PLAYING', 'OUT')),
        "position" varchar(16),
        UNIQUE ("roundId", "playerId")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "game_round_assignment"');
    await queryRunner.query('DROP TABLE "game_round"');
    await queryRunner.query('DROP TABLE "game"');
  }
}
