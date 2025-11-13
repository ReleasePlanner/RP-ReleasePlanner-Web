/**
 * TypeORM CLI Configuration
 * 
 * Used by TypeORM CLI for migrations and schema management
 */
import { DataSource } from 'typeorm';
import * as path from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'releaseplanner',
  password: process.env.DATABASE_PASSWORD || 'releaseplanner123',
  database: process.env.DATABASE_NAME || 'releaseplanner',
  entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false, // Never use synchronize in production
  logging: process.env.NODE_ENV === 'development',
});

