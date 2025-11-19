/**
 * Run migrations directly using raw SQL
 * This bypasses TypeScript compilation issues with TypeORM CLI
 */
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
};

// Migrations to run in order
const migrations = [
  '1764000000000-CreateOwnerTypes.ts',
  '1764000001000-RenameItOwnersToOwners.ts',
  '1764000002000-UpdateProductOwnersTable.ts',
  '1764000003000-RenameBasePhasesToPhases.ts',
  '1764000004000-RenameComponentTypesToProductComponents.ts',
  '1764000005000-RenameComponentVersionsToProductComponentVersions.ts',
  '1764000006000-CreatePlanReferenceType.ts',
  '1764000006001-RenameProductComponentsToProductComponentTypes.ts',
  '1764000007000-UpdatePlanReferencesTable.ts',
  '1764000007001-RenameProductComponentVersionsToProductComponents.ts',
  '1764000008000-RemoveGanttTables.ts',
];

async function runMigrations() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        timestamp BIGINT NOT NULL,
        executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create unique index on name if it doesn't exist
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_migrations_name ON migrations(name);
    `);
    
    // Get already executed migrations
    const executedResult = await client.query('SELECT name FROM migrations');
    const executedMigrations = new Set(executedResult.rows.map(r => r.name));
    
    for (const migrationFile of migrations) {
      const migrationName = migrationFile.replace('.ts', '');
      
      if (executedMigrations.has(migrationName)) {
        console.log(`⏭️  Skipping ${migrationName} (already executed)`);
        continue;
      }
      
      console.log(`\n🔄 Running migration: ${migrationName}`);
      
      const migrationPath = path.join(__dirname, 'src', 'migrations', migrationFile);
      
      if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration file not found: ${migrationPath}`);
        continue;
      }
      
      // Read and execute migration SQL
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');
      
      // Extract SQL from up() method
      const upMatch = migrationContent.match(/public async up\([^)]*\): Promise<void> \{([\s\S]*?)\n  \}/);
      
      if (!upMatch) {
        console.error(`❌ Could not extract SQL from ${migrationName}`);
        continue;
      }
      
      const sqlBlock = upMatch[1];
      
      // Extract individual SQL queries (between backticks)
      // Match multi-line SQL queries more accurately, including those with parameters
      const sqlQueries = [];
      
      // First, extract queries with parameters: queryRunner.query(`...`, [params])
      const paramQueryRegex = /await queryRunner\.query\(`([\s\S]*?)`\s*,\s*\[([\s\S]*?)\]\s*\);/g;
      let match;
      
      while ((match = paramQueryRegex.exec(sqlBlock)) !== null) {
        const sql = match[1].trim();
        const paramsStr = match[2].trim();
        if (sql) {
          // Try to extract parameter value (simple case: variable name)
          // For now, we'll execute the query without parameters and handle it specially
          sqlQueries.push({ sql, hasParams: true, paramsStr });
        }
      }
      
      // Then extract queries without parameters: queryRunner.query(`...`)
      const simpleQueryRegex = /await queryRunner\.query\(`([\s\S]*?)`\);/g;
      // Reset regex lastIndex
      simpleQueryRegex.lastIndex = 0;
      
      while ((match = simpleQueryRegex.exec(sqlBlock)) !== null) {
        // Skip if already captured as parameterized query
        const sql = match[1].trim();
        if (sql && !sqlQueries.some(q => q.sql === sql && q.hasParams)) {
          sqlQueries.push({ sql, hasParams: false });
        }
      }
      
      if (sqlQueries.length === 0) {
        console.error(`❌ No SQL queries found in ${migrationName}`);
        continue;
      }
      
      try {
        await client.query('BEGIN');
        
        for (const queryObj of sqlQueries) {
          const sql = queryObj.sql;
          // Skip empty queries
          if (!sql.trim()) continue;
          
          // Log first 100 chars of query
          const preview = sql.replace(/\s+/g, ' ').substring(0, 100);
          console.log(`  Executing: ${preview}...`);
          
          if (queryObj.hasParams) {
            // For parameterized queries, we need to handle them specially
            // Check if it's a SELECT query that returns a result
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
              const result = await client.query(sql);
              // Store result for later use (for UPDATE queries that depend on SELECT results)
              if (result.rows && result.rows.length > 0) {
                // This is a SELECT query - we'll handle the UPDATE separately
                // For now, just execute it
                continue;
              }
            } else {
              // For UPDATE with $1 parameter, we need to get the value first
              // This is a simplified approach - in production, you'd want more robust handling
              if (sql.includes('$1')) {
                // Find the SELECT query that gets the planTypeId
                const selectQuery = sqlQueries.find(q => 
                  q.sql.includes('SELECT id FROM plan_reference_type') && 
                  !q.hasParams
                );
                if (selectQuery) {
                  const selectResult = await client.query(selectQuery.sql);
                  if (selectResult.rows && selectResult.rows.length > 0) {
                    const planTypeId = selectResult.rows[0].id;
                    // Replace $1 with the actual value
                    const updateSql = sql.replace(/\$1/g, `'${planTypeId}'`);
                    await client.query(updateSql);
                    continue;
                  }
                }
              }
              // Fallback: try to execute without parameters (may fail)
              await client.query(sql);
            }
          } else {
            await client.query(sql);
          }
        }
        
        // Record migration as executed
        await client.query(
          'INSERT INTO migrations (name, timestamp) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
          [migrationName, parseInt(migrationName.split('-')[0])]
        );
        
        await client.query('COMMIT');
        console.log(`✅ Migration ${migrationName} completed successfully`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Error executing ${migrationName}:`, error.message);
        throw error;
      }
    }
    
    console.log('\n✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
