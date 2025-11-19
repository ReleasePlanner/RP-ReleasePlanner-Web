import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameComponentTypesToProductComponents1764000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename table
    await queryRunner.query(`ALTER TABLE component_types RENAME TO product_components;`);
    
    // Rename indexes
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_component_types_name RENAME TO idx_product_components_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_component_types_name" RENAME TO "IDX_product_components_name";`);
    
    // Update foreign key in component_versions table
    // Note: This will be updated again in migration 1764000006001 to reference product_component_types
    await queryRunner.query(`
      ALTER TABLE component_versions 
      DROP CONSTRAINT IF EXISTS fk_component_versions_component_type;
    `);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      ADD CONSTRAINT fk_component_versions_product_component 
      FOREIGN KEY ("componentTypeId") REFERENCES product_components(id) ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: This down migration assumes product_component_types exists (from later migration)
    // If rolling back, we need to handle the case where product_component_types was renamed to product_components
    await queryRunner.query(`ALTER TABLE IF EXISTS product_component_types RENAME TO component_types;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_component_types_name RENAME TO idx_component_types_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_component_types_name" RENAME TO "IDX_component_types_name";`);
    
    // Also handle case where table is still named product_components (if migration 1764000006001 hasn't run)
    await queryRunner.query(`ALTER TABLE IF EXISTS product_components RENAME TO component_types;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_components_name RENAME TO idx_component_types_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_components_name" RENAME TO "IDX_component_types_name";`);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      DROP CONSTRAINT IF EXISTS fk_component_versions_product_component_type;
    `);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      ADD CONSTRAINT fk_component_versions_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES component_types(id) ON DELETE SET NULL;
    `);
  }
}

