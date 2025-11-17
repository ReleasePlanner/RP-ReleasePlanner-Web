/**
 * Script to run AddMilestoneColorToPlanReferences migration
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

async function main() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');
    
    const sqlFile = path.join(__dirname, 'run-add-milestone-color-migration.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('\n📄 Executing migration: AddMilestoneColorToPlanReferences');
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('⚠️  Column already exists - migration may have been applied already');
    } else {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

main();

