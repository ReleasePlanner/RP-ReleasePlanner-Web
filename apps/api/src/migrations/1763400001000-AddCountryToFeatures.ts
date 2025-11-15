import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryToFeatures1763400001000 implements MigrationInterface {
  name = 'AddCountryToFeatures1763400001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add countryId column to features table
    await queryRunner.query(`
      ALTER TABLE "features" 
      ADD COLUMN IF NOT EXISTS "countryId" uuid NULL
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "features" 
      ADD CONSTRAINT "FK_features_country" 
      FOREIGN KEY ("countryId") 
      REFERENCES "countries"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);

    // Register migration
    await queryRunner.query(`
      INSERT INTO "migrations" ("timestamp", "name")
      SELECT 1763400001000, 'AddCountryToFeatures1763400001000'
      WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'AddCountryToFeatures1763400001000')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "features" 
      DROP CONSTRAINT IF EXISTS "FK_features_country"
    `);

    // Drop column
    await queryRunner.query(`
      ALTER TABLE "features" 
      DROP COLUMN IF EXISTS "countryId"
    `);
  }
}

