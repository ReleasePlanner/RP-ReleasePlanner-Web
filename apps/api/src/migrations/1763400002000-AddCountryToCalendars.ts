import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryToCalendars1763400002000 implements MigrationInterface {
  name = 'AddCountryToCalendars1763400002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add countryId column to calendars table
    await queryRunner.query(`
      ALTER TABLE "calendars" 
      ADD COLUMN IF NOT EXISTS "countryId" uuid NULL
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "calendars" 
      ADD CONSTRAINT "FK_calendars_country" 
      FOREIGN KEY ("countryId") 
      REFERENCES "countries"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);

    // Register migration
    await queryRunner.query(`
      INSERT INTO "migrations" ("timestamp", "name")
      SELECT 1763400002000, 'AddCountryToCalendars1763400002000'
      WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'AddCountryToCalendars1763400002000')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "calendars" 
      DROP CONSTRAINT IF EXISTS "FK_calendars_country"
    `);

    // Drop column
    await queryRunner.query(`
      ALTER TABLE "calendars" 
      DROP COLUMN IF EXISTS "countryId"
    `);
  }
}

