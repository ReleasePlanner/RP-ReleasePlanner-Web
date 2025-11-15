import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameToComponentVersions1763175000000 implements MigrationInterface {
  name = 'AddNameToComponentVersions1763175000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      ADD COLUMN IF NOT EXISTS "name" VARCHAR(255) NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      DROP COLUMN IF EXISTS "name"
    `);
  }
}

