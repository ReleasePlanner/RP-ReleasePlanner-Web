/**
 * Script to run RenameProductComponentVersionsToProductComponents migration
 */

const { Client } = require('pg');

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
      ['1764000007001-RenameProductComponentVersionsToProductComponents']
    );
    
    if (checkResult.rows.length > 0) {
      console.log('⏭️  Migration already executed, skipping...');
      await client.query('COMMIT');
      return;
    }
    
    console.log('\n📄 Executing migration: RenameProductComponentVersionsToProductComponents');
    
    // Check if product_components already exists
    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_components'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('⚠️  Table product_components already exists');
      // Check if product_component_versions still exists
      const checkOldTable = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'product_component_versions'
        );
      `);
      
      if (checkOldTable.rows[0].exists) {
        console.log('⚠️  Table product_component_versions still exists - migrating data and dropping old table');
        
        // Migrate data from product_component_versions to product_components if needed
        const countOld = await client.query('SELECT COUNT(*) as count FROM product_component_versions');
        const countNew = await client.query('SELECT COUNT(*) as count FROM product_components');
        
        if (parseInt(countOld.rows[0].count) > 0 && parseInt(countNew.rows[0].count) === 0) {
          console.log('📦 Migrating data from product_component_versions to product_components...');
          await client.query(`
            INSERT INTO product_components (id, "createdAt", "updatedAt", name, "componentTypeId", "currentVersion", "previousVersion", "productId")
            SELECT id, "createdAt", "updatedAt", name, "componentTypeId", "currentVersion", "previousVersion", "productId"
            FROM product_component_versions
            WHERE "componentTypeId" IS NOT NULL
            ON CONFLICT (id) DO NOTHING;
          `);
          console.log('✅ Data migrated');
        }
        
        // Drop foreign key constraint from old table
        await client.query(`
          ALTER TABLE product_component_versions 
          DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component_type;
        `);
        
        await client.query(`
          ALTER TABLE product_component_versions 
          DROP CONSTRAINT IF EXISTS fk_product_component_versions_product;
        `);
        
        // Drop the old table
        await client.query(`DROP TABLE IF EXISTS product_component_versions CASCADE;`);
        console.log('✅ Dropped old table product_component_versions');
      } else {
        console.log('✅ Table product_component_versions already dropped');
      }
      
      // Ensure type column doesn't exist in product_components
      const checkTypeColumn = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'product_components' 
          AND column_name = 'type'
        );
      `);
      
      if (checkTypeColumn.rows[0].exists) {
        await client.query(`
          ALTER TABLE product_components 
          DROP COLUMN IF EXISTS type;
        `);
        console.log('✅ Dropped type column from product_components');
      }
      
      // Drop the enum type if it exists
      await client.query(`
        DROP TYPE IF EXISTS product_component_versions_type_enum;
      `);
      console.log('✅ Dropped enum type');
    } else {
      // Original migration path - rename table
      // Drop foreign key constraint first
      await client.query(`
        ALTER TABLE product_component_versions 
        DROP CONSTRAINT IF EXISTS fk_product_component_versions_product_component_type;
      `);
      console.log('✅ Dropped foreign key constraint');
      
      // Drop the type column (enum column)
      await client.query(`
        ALTER TABLE product_component_versions 
        DROP COLUMN IF EXISTS type;
      `);
      console.log('✅ Dropped type column');
      
      // Drop the enum type if it exists (only if no other tables use it)
      await client.query(`
        DROP TYPE IF EXISTS product_component_versions_type_enum;
      `);
      console.log('✅ Dropped enum type');
      
      // Rename table
      await client.query(`ALTER TABLE product_component_versions RENAME TO product_components;`);
      console.log('✅ Renamed table product_component_versions to product_components');
    }
    
    // Rename indexes
    await client.query(`ALTER INDEX IF EXISTS idx_product_component_versions_product_id RENAME TO idx_product_components_product_id;`);
    await client.query(`ALTER INDEX IF EXISTS "IDX_product_component_versions_productId" RENAME TO "IDX_product_components_productId";`);
    console.log('✅ Renamed indexes');
    
    // Recreate foreign key constraint with new table name
    await client.query(`
      ALTER TABLE product_components 
      ADD CONSTRAINT fk_product_components_product_component_type 
      FOREIGN KEY ("componentTypeId") REFERENCES product_component_types(id) ON DELETE SET NULL;
    `);
    console.log('✅ Recreated foreign key constraint for componentTypeId');
    
    // Update foreign key constraint name for product
    await client.query(`
      ALTER TABLE product_components 
      DROP CONSTRAINT IF EXISTS fk_product_component_versions_product;
    `);
    
    await client.query(`
      ALTER TABLE product_components 
      ADD CONSTRAINT fk_product_components_product 
      FOREIGN KEY ("productId") REFERENCES products(id) ON DELETE CASCADE;
    `);
    console.log('✅ Updated foreign key constraint for productId');
    
    // Record migration as executed
    await client.query(
      'INSERT INTO migrations (name, timestamp) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      ['1764000007001-RenameProductComponentVersionsToProductComponents', 1764000007001]
    );
    
    await client.query('COMMIT');
    console.log('✅ Migration 1764000007001-RenameProductComponentVersionsToProductComponents completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.message.includes('does not exist') && error.message.includes('product_component_versions')) {
      console.log('⚠️  Table product_component_versions does not exist - may have been renamed already');
      console.log('   Checking if product_components exists...');
      const checkTable = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'product_components'
        );
      `);
      if (checkTable.rows[0].exists) {
        console.log('✅ Table product_components already exists - migration may have been applied');
        // Record migration as executed anyway
        await client.query(
          'INSERT INTO migrations (name, timestamp) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
          ['1764000007001-RenameProductComponentVersionsToProductComponents', 1764000007001]
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

