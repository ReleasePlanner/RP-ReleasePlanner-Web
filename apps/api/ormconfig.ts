/**
 * TypeORM CLI Configuration
 * 
 * Used by TypeORM CLI for migrations and schema management
 * This file uses CommonJS format for compatibility with TypeORM CLI
 */
const { DataSource } = require('typeorm');
const path = require('path');

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'demo',
  database: process.env.DATABASE_NAME || 'rp-releases',
  entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false, // Never use synchronize in production
  logging: process.env.NODE_ENV === 'development',
});

module.exports = dataSource;

