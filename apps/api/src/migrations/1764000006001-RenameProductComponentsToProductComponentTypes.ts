import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProductComponentsToProductComponentTypes1764000006001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename table
    await queryRunner.query(`ALTER TABLE product_components RENAME TO product_component_types;`);
    
    // Rename indexes
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_components_name RENAME TO idx_product_component_types_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_components_name" RENAME TO "IDX_product_component_types_name";`);
    
    // Update foreign key constraint in product_component_versions table
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      ADD CONSTRAINT fk_product_component_versions_product_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES product_component_types(id) ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert foreign key constraint
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component_type;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      ADD CONSTRAINT fk_product_component_versions_product_component 
      FOREIGN KEY ("componentTypeId") REFERENCES product_components(id) ON DELETE SET NULL;
    `);
    
    // Rename indexes back
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_component_types_name RENAME TO idx_product_components_name;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_component_types_name" RENAME TO "IDX_product_components_name";`);
    
    // Rename table back
    await queryRunner.query(`ALTER TABLE product_component_types RENAME TO product_components;`);
  }
}

