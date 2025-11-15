/**
 * Script to run database migrations manually
 * This bypasses TypeORM CLI compilation issues
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

async function runMigration(client, sqlFile) {
  const sql = fs.readFileSync(sqlFile, 'utf8');
  console.log(`\n📄 Executing migration: ${path.basename(sqlFile)}`);
  
  try {
    await client.query(sql);
    console.log(`✅ Migration completed successfully: ${path.basename(sqlFile)}`);
    return true;
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log(`⚠️  Migration already applied or skipped: ${path.basename(sqlFile)}`);
      return true;
    }
    console.error(`❌ Error executing migration ${path.basename(sqlFile)}:`, error.message);
    throw error;
  }
}

async function main() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');
    
    const migrations = [
      path.join(__dirname, 'run-countries-migrations.sql'),
      path.join(__dirname, 'run-add-country-to-features-migration.sql'),
      path.join(__dirname, 'run-add-country-to-calendars-migration.sql'),
    ];
    
    for (const migrationFile of migrations) {
      if (fs.existsSync(migrationFile)) {
        await runMigration(client, migrationFile);
      } else {
        console.warn(`⚠️  Migration file not found: ${migrationFile}`);
      }
    }
    
    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

main();

