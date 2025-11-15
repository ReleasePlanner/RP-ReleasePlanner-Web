import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeatureCategories1763300000000 implements MigrationInterface {
  name = 'CreateFeatureCategories1763300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create feature_categories table if it doesn't exist
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "feature_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" VARCHAR(255) NOT NULL,
        CONSTRAINT "PK_feature_categories" PRIMARY KEY ("id")
      )
    `);

    // Create unique index on name if it doesn't exist
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_feature_categories_name" ON "feature_categories" ("name")
    `);

    // Insert default categories if they don't exist
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Authentication' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Authentication')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Performance' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Performance')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Security' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Security')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'UI/UX' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'UI/UX')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Infrastructure' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Infrastructure')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Documentation' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Documentation')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Testing' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Testing')
    `);
    await queryRunner.query(`
      INSERT INTO "feature_categories" ("name")
      SELECT 'Integration' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Integration')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_feature_categories_name"`);
    
    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "feature_categories"`);
  }
}

