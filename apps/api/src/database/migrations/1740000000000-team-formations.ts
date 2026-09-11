import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamFormations1740000000000 implements MigrationInterface {
  name = 'TeamFormations1740000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team" ADD "formation" jsonb NOT NULL DEFAULT '{"defender": 2, "forward": 2}'`,
    );
    await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "formation" DROP DEFAULT');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "team" DROP COLUMN "formation"');
  }
}
