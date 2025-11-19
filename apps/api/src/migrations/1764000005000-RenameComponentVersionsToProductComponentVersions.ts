import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameComponentVersionsToProductComponentVersions1764000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename table
    await queryRunner.query(`ALTER TABLE component_versions RENAME TO product_component_versions;`);
    
    // Rename indexes
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_component_versions_product_id RENAME TO idx_product_component_versions_product_id;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_component_versions_productId" RENAME TO "IDX_product_component_versions_productId";`);
    
    // Update foreign key constraint names
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      DROP CONSTRAINT IF EXISTS fk_component_versions_product;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      ADD CONSTRAINT fk_product_component_versions_product 
      FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE;
    `);
    
    // Update the foreign key to product_component_types (previously product_components, originally component_types)
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      DROP CONSTRAINT IF EXISTS fk_component_versions_component_type;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      ADD CONSTRAINT fk_product_component_versions_product_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES product_component_types(id) ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE product_component_versions RENAME TO component_versions;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_component_versions_product_id RENAME TO idx_component_versions_product_id;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_component_versions_productId" RENAME TO "IDX_component_versions_productId";`);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product;
    `);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      ADD CONSTRAINT fk_component_versions_product 
      FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE;
    `);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component_type;
    `);
    
    await queryRunner.query(`
      ALTER TABLE component_versions 
      ADD CONSTRAINT fk_component_versions_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES component_types(id) ON DELETE SET NULL;
    `);
  }
}

