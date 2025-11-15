import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCategoryFromBasePhases1763173151000 implements MigrationInterface {
  name = 'RemoveCategoryFromBasePhases1763173151000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove category column from base_phases table
    await queryRunner.query(`
      ALTER TABLE "base_phases" 
      DROP COLUMN IF EXISTS "category"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore category column (nullable)
    await queryRunner.query(`
      ALTER TABLE "base_phases" 
      ADD COLUMN IF NOT EXISTS "category" VARCHAR(100)
    `);
  }
}

