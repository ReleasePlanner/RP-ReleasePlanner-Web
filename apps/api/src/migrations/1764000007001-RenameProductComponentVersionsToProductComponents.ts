import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameProductComponentVersionsToProductComponents1764000007001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint first
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component_type;
    `);
    
    // Drop the type column (enum column)
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      DROP COLUMN IF EXISTS type;
    `);
    
    // Drop the enum type if it exists (only if no other tables use it)
    await queryRunner.query(`
      DROP TYPE IF EXISTS product_component_versions_type_enum;
    `);
    
    // Rename table
    await queryRunner.query(`ALTER TABLE product_component_versions RENAME TO product_components;`);
    
    // Rename indexes
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_component_versions_product_id RENAME TO idx_product_components_product_id;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_component_versions_productId" RENAME TO "IDX_product_components_productId";`);
    
    // Recreate foreign key constraint with new table name
    await queryRunner.query(`
      ALTER TABLE product_components 
      ADD CONSTRAINT fk_product_components_product_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES product_component_types(id) ON DELETE SET NULL;
    `);
    
    // Update foreign key constraint name for product
    await queryRunner.query(`
      ALTER TABLE product_components 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_components 
      ADD CONSTRAINT fk_product_components_product 
      FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert foreign key constraints
    await queryRunner.query(`
      ALTER TABLE product_components 
      DROP CONSTRAINT IF EXISTS fk_product_components_product;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_components 
      ADD CONSTRAINT fk_product_component_versions_product 
      FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_components 
      DROP CONSTRAINT IF EXISTS fk_product_components_product_component_type;
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_components 
      ADD CONSTRAINT fk_product_component_versions_product_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES product_component_types(id) ON DELETE SET NULL;
    `);
    
    // Rename indexes back
    await queryRunner.query(`ALTER INDEX IF EXISTS idx_product_components_product_id RENAME TO idx_product_component_versions_product_id;`);
    await queryRunner.query(`ALTER INDEX IF EXISTS "IDX_product_components_productId" RENAME TO "IDX_product_component_versions_productId";`);
    
    // Rename table back
    await queryRunner.query(`ALTER TABLE product_components RENAME TO product_component_versions;`);
    
    // Recreate type column (as nullable enum)
    await queryRunner.query(`
      CREATE TYPE product_component_versions_type_enum AS ENUM ('web', 'services', 'mobile');
    `);
    
    await queryRunner.query(`
      ALTER TABLE product_component_versions 
      ADD COLUMN type product_component_versions_type_enum NULL;
    `);
    
    // Migrate data back from componentTypeId to type
    await queryRunner.query(`
      UPDATE product_component_versions pcv
      SET type = pct.code::product_component_versions_type_enum
      FROM product_component_types pct
      WHERE pcv."componentTypeId" = pct.id AND pct.code IN ('web', 'services', 'mobile');
    `);
  }
}

