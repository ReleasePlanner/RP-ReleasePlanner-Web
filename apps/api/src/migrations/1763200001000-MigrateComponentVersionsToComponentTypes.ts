import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateComponentVersionsToComponentTypes1763200001000 implements MigrationInterface {
  name = 'MigrateComponentVersionsToComponentTypes1763200001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add componentTypeId column to component_versions
    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      ADD COLUMN "componentTypeId" uuid NULL
    `);

    // Create foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      ADD CONSTRAINT "FK_component_versions_component_type" 
      FOREIGN KEY ("componentTypeId") REFERENCES "component_types"("id") ON DELETE RESTRICT
    `);

    // Migrate existing data: map enum values to component_types
    await queryRunner.query(`
      UPDATE "component_versions" cv
      SET "componentTypeId" = ct.id
      FROM "component_types" ct
      WHERE cv.type::text = ct.code
    `);

    // Make componentTypeId NOT NULL after migration
    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      ALTER COLUMN "componentTypeId" SET NOT NULL
    `);

    // Drop the enum type column (we'll keep it for now for backward compatibility)
    // ALTER TABLE "component_versions" DROP COLUMN "type";
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore type column from componentTypeId
    await queryRunner.query(`
      UPDATE "component_versions" cv
      SET type = ct.code::component_versions_type_enum
      FROM "component_types" ct
      WHERE cv."componentTypeId" = ct.id
    `);

    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      DROP CONSTRAINT IF EXISTS "FK_component_versions_component_type"
    `);

    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      DROP COLUMN IF EXISTS "componentTypeId"
    `);
  }
}

