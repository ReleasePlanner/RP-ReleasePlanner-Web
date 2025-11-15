-- Migration: CreateFeatureCategories1763300000000
-- Description: Creates the feature_categories table and inserts default data

-- Create feature_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS "feature_categories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "name" VARCHAR(255) NOT NULL,
  CONSTRAINT "PK_feature_categories" PRIMARY KEY ("id")
);

-- Create unique index on name if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_feature_categories_name" ON "feature_categories" ("name");

-- Insert default categories if they don't exist
INSERT INTO "feature_categories" ("name")
SELECT 'Authentication' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Authentication');

INSERT INTO "feature_categories" ("name")
SELECT 'Performance' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Performance');

INSERT INTO "feature_categories" ("name")
SELECT 'Security' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Security');

INSERT INTO "feature_categories" ("name")
SELECT 'UI/UX' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'UI/UX');

INSERT INTO "feature_categories" ("name")
SELECT 'Infrastructure' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Infrastructure');

INSERT INTO "feature_categories" ("name")
SELECT 'Documentation' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Documentation');

INSERT INTO "feature_categories" ("name")
SELECT 'Testing' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Testing');

INSERT INTO "feature_categories" ("name")
SELECT 'Integration' WHERE NOT EXISTS (SELECT 1 FROM "feature_categories" WHERE "name" = 'Integration');

-- Register migration in migrations table (if it exists)
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1763300000000, 'CreateFeatureCategories1763300000000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'CreateFeatureCategories1763300000000');

