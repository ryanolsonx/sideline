import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamCoachUsernames1730000000000 implements MigrationInterface {
  name = 'TeamCoachUsernames1730000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team" ADD "coachUsername" varchar(80) NOT NULL DEFAULT 'legacy'`,
    );
    await queryRunner.query(
      `UPDATE "team" SET "coachUsername" = 'legacy-' || "id"::text`,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_team_coachUsername" ON "team" ("coachUsername")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_team_coachUsername"');
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "coachUsername"');
  }
}
