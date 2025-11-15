-- Migration: CreateCountries (1763400000000)
-- Create countries table and insert default data

BEGIN;

-- Create countries table
CREATE TABLE IF NOT EXISTS "countries" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR(255) NOT NULL,
  "code" VARCHAR(10) NOT NULL,
  "isoCode" VARCHAR(10) NULL,
  "region" VARCHAR(255) NULL,
  CONSTRAINT "PK_countries" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_countries_name" ON "countries" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_countries_code" ON "countries" ("code");

-- Insert default countries
INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'United States', 'US', 'USA', 'North America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'US');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Canada', 'CA', 'CAN', 'North America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'CA');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Mexico', 'MX', 'MEX', 'North America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'MX');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'United Kingdom', 'GB', 'GBR', 'Europe'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'GB');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Germany', 'DE', 'DEU', 'Europe'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'DE');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'France', 'FR', 'FRA', 'Europe'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'FR');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Spain', 'ES', 'ESP', 'Europe'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'ES');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Italy', 'IT', 'ITA', 'Europe'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'IT');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Brazil', 'BR', 'BRA', 'South America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'BR');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Argentina', 'AR', 'ARG', 'South America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'AR');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Chile', 'CL', 'CHL', 'South America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'CL');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Colombia', 'CO', 'COL', 'South America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'CO');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Peru', 'PE', 'PER', 'South America'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'PE');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'China', 'CN', 'CHN', 'Asia'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'CN');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Japan', 'JP', 'JPN', 'Asia'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'JP');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'India', 'IN', 'IND', 'Asia'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'IN');

INSERT INTO "countries" ("name", "code", "isoCode", "region")
SELECT 'Australia', 'AU', 'AUS', 'Oceania'
WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = 'AU');

-- Register migration
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1763400000000, 'CreateCountries1763400000000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'CreateCountries1763400000000');

COMMIT;

