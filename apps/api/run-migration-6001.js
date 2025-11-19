/**
 * Script to run RenameProductComponentsToProductComponentTypes migration
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
};

async function runMigration() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');
    
    await client.query('BEGIN');
    
    // Check if migration already executed
    const checkResult = await client.query(
      'SELECT name FROM migrations WHERE name = $1',
      ['1764000006001-RenameProductComponentsToProductComponentTypes']
    );
    
    if (checkResult.rows.length > 0) {
      console.log('⏭️  Migration already executed, skipping...');
      await client.query('COMMIT');
      return;
    }
    
    console.log('\n📄 Executing migration: RenameProductComponentsToProductComponentTypes');
    
    // Rename table
    await client.query(`ALTER TABLE product_components RENAME TO product_component_types;`);
    console.log('✅ Renamed table product_components to product_component_types');
    
    // Rename indexes
    await client.query(`ALTER INDEX IF EXISTS idx_product_components_name RENAME TO idx_product_component_types_name;`);
    await client.query(`ALTER INDEX IF EXISTS "IDX_product_components_name" RENAME TO "IDX_product_component_types_name";`);
    console.log('✅ Renamed indexes');
    
    // Update foreign key constraint in product_component_versions table
    await client.query(`
      ALTER TABLE product_component_versions 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component;
    `);
    
    await client.query(`
      ALTER TABLE product_component_versions 
      ADD CONSTRAINT fk_product_component_versions_product_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES product_component_types(id) ON DELETE SET NULL;
    `);
    console.log('✅ Updated foreign key constraint');
    
    // Record migration as executed
    await client.query(
      'INSERT INTO migrations (name, timestamp) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      ['1764000006001-RenameProductComponentsToProductComponentTypes', 1764000006001]
    );
    
    await client.query('COMMIT');
    console.log('✅ Migration 1764000006001-RenameProductComponentsToProductComponentTypes completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message.includes('does not exist') && error.message.includes('product_components')) {
      console.log('⚠️  Table product_components does not exist - may have been renamed already');
      console.log('   Checking if product_component_types exists...');
      const checkTable = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'product_component_types'
        );
      `);
      if (checkTable.rows[0].exists) {
        console.log('✅ Table product_component_types already exists - migration may have been applied');
        // Record migration as executed anyway
        await client.query(
          'INSERT INTO migrations (name, timestamp) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
          ['1764000006001-RenameProductComponentsToProductComponentTypes', 1764000006001]
        );
        await client.query('COMMIT');
        return;
      }
    }
    console.error('❌ Migration error:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

runMigration().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

