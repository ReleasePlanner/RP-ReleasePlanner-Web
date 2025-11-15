-- Migration 1: Create component_types table
CREATE TABLE IF NOT EXISTS "component_types" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "name" VARCHAR(255) NOT NULL,
  "code" VARCHAR(100) NULL,
  "description" TEXT NULL,
  CONSTRAINT "PK_component_types" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_component_types_name" ON "component_types" ("name");
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_component_types_code" ON "component_types" ("code") WHERE "code" IS NOT NULL;

-- Insert default component types (only if they don't exist)
INSERT INTO "component_types" ("name", "code", "description")
SELECT 'Web', 'web', 'Web-based applications and frontends'
WHERE NOT EXISTS (SELECT 1 FROM "component_types" WHERE "code" = 'web');

INSERT INTO "component_types" ("name", "code", "description")
SELECT 'Services', 'services', 'Backend services and APIs'
WHERE NOT EXISTS (SELECT 1 FROM "component_types" WHERE "code" = 'services');

INSERT INTO "component_types" ("name", "code", "description")
SELECT 'Mobile', 'mobile', 'Mobile applications (iOS, Android)'
WHERE NOT EXISTS (SELECT 1 FROM "component_types" WHERE "code" = 'mobile');

-- Migration 2: Add componentTypeId column to component_versions
ALTER TABLE "component_versions" 
ADD COLUMN IF NOT EXISTS "componentTypeId" uuid NULL;

-- Create foreign key constraint (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'FK_component_versions_component_type'
  ) THEN
    ALTER TABLE "component_versions" 
    ADD CONSTRAINT "FK_component_versions_component_type" 
    FOREIGN KEY ("componentTypeId") REFERENCES "component_types"("id") ON DELETE RESTRICT;
  END IF;
END $$;

-- Migrate existing data: map enum values to component_types
UPDATE "component_versions" cv
SET "componentTypeId" = ct.id
FROM "component_types" ct
WHERE cv.type::text = ct.code
  AND cv."componentTypeId" IS NULL;

-- Note: We keep the type column for backward compatibility
-- If you want to make componentTypeId NOT NULL, uncomment the following:
-- ALTER TABLE "component_versions" 
-- ALTER COLUMN "componentTypeId" SET NOT NULL;

