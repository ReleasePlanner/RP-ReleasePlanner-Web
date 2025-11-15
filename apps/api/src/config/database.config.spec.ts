/**
 * Database Config Unit Tests
 * Coverage: 100%
 */
import databaseConfig from "./database.config";

// Type helper for database config with PostgreSQL connection properties
type DatabaseConfigWithConnection = {
  type: "postgres";
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
  logging?: boolean;
  entities?: string[];
  migrations?: string[];
  migrationsRun?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  autoLoadEntities?: boolean;
  extra?: {
    max?: number;
    min?: number;
    idleTimeoutMillis?: number;
    connectionTimeoutMillis?: number;
  };
};

describe("DatabaseConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("default configuration", () => {
    it("should return default database configuration", () => {
      const config = databaseConfig() as DatabaseConfigWithConnection;

      expect(config.type).toBe("postgres");
      expect(config.host).toBe("localhost");
      expect(config.port).toBe(5432);
      expect(config.username).toBe("releaseplanner");
      expect(config.password).toBe("releaseplanner123");
      expect(config.database).toBe("releaseplanner");
      expect(config.synchronize).toBe(true); // Not production
      expect(config.logging).toBe(false); // Not development
      expect(config.retryAttempts).toBe(3);
      expect(config.retryDelay).toBe(3000);
      expect(config.autoLoadEntities).toBe(true);
    });

    it("should use environment variables when provided", () => {
      process.env.DATABASE_HOST = "custom-host";
      process.env.DATABASE_PORT = "5433";
      process.env.DATABASE_USER = "custom-user";
      process.env.DATABASE_PASSWORD = "custom-password";
      process.env.DATABASE_NAME = "custom-db";

      const config = databaseConfig() as DatabaseConfigWithConnection;

      expect(config.host).toBe("custom-host");
      expect(config.port).toBe(5433);
      expect(config.username).toBe("custom-user");
      expect(config.password).toBe("custom-password");
      expect(config.database).toBe("custom-db");
    });

    it("should set synchronize to false in production", () => {
      process.env.NODE_ENV = "production";

      const config = databaseConfig();

      expect(config.synchronize).toBe(false);
    });

    it("should set logging to true in development", () => {
      process.env.NODE_ENV = "development";

      const config = databaseConfig();

      expect(config.logging).toBe(true);
    });

    it("should use custom connection pool settings", () => {
      process.env.DATABASE_POOL_MAX = "20";
      process.env.DATABASE_POOL_MIN = "5";
      process.env.DATABASE_POOL_IDLE_TIMEOUT = "60000";
      process.env.DATABASE_CONNECTION_TIMEOUT = "5000";

      const config = databaseConfig();

      expect(config.extra.max).toBe(20);
      expect(config.extra.min).toBe(5);
      expect(config.extra.idleTimeoutMillis).toBe(60000);
      expect(config.extra.connectionTimeoutMillis).toBe(5000);
    });

    it("should use default connection pool settings", () => {
      const config = databaseConfig();

      expect(config.extra.max).toBe(10);
      expect(config.extra.min).toBe(2);
      expect(config.extra.idleTimeoutMillis).toBe(30000);
      expect(config.extra.connectionTimeoutMillis).toBe(2000);
    });

    it("should set migrationsRun to true when RUN_MIGRATIONS is true", () => {
      process.env.RUN_MIGRATIONS = "true";

      const config = databaseConfig();

      expect(config.migrationsRun).toBe(true);
    });

    it("should set migrationsRun to false when RUN_MIGRATIONS is not set", () => {
      delete process.env.RUN_MIGRATIONS;

      const config = databaseConfig();

      expect(config.migrationsRun).toBe(false);
    });

    it("should include entities path", () => {
      const config = databaseConfig();

      expect(config.entities).toBeDefined();
      expect(Array.isArray(config.entities)).toBe(true);
    });

    it("should include migrations path", () => {
      const config = databaseConfig();

      expect(config.migrations).toBeDefined();
      expect(Array.isArray(config.migrations)).toBe(true);
    });
  });
});
