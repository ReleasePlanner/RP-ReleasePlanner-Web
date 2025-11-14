/**
 * Database Configuration
 *
 * TypeORM configuration for PostgreSQL connection
 */
import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default registerAs(
  "database",
  (): TypeOrmModuleOptions => ({
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "demo",
    database: process.env.DATABASE_NAME || "rp-releases",
    // Use autoLoadEntities instead of explicit entities path to avoid ES module issues
    // autoLoadEntities will automatically discover entities from imported modules
    entities:
      process.env.NODE_ENV === "production"
        ? [__dirname + "/../**/*.entity.js"]
        : [],
    synchronize: process.env.NODE_ENV !== "production", // Auto-sync only in development
    logging: process.env.NODE_ENV === "development",
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    migrationsRun: process.env.RUN_MIGRATIONS === "true", // Set RUN_MIGRATIONS=true to run migrations on startup
    retryAttempts: 3,
    retryDelay: 3000,
    autoLoadEntities: true, // This will discover entities from imported modules in development
    // Connection pool settings
    extra: {
      max: parseInt(process.env.DATABASE_POOL_MAX || "10", 10),
      min: parseInt(process.env.DATABASE_POOL_MIN || "2", 10),
      idleTimeoutMillis: parseInt(
        process.env.DATABASE_POOL_IDLE_TIMEOUT || "30000",
        10
      ),
      connectionTimeoutMillis: parseInt(
        process.env.DATABASE_CONNECTION_TIMEOUT || "2000",
        10
      ),
    },
  })
);
