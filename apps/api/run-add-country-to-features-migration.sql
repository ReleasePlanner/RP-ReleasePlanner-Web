-- Migration: AddCountryToFeatures (1763400001000)
-- Add countryId column to features table

BEGIN;

-- Add countryId column to features table
ALTER TABLE "features" 
ADD COLUMN IF NOT EXISTS "countryId" uuid NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'FK_features_country'
  ) THEN
    ALTER TABLE "features" 
    ADD CONSTRAINT "FK_features_country" 
    FOREIGN KEY ("countryId") 
    REFERENCES "countries"("id") 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Register migration
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1763400001000, 'AddCountryToFeatures1763400001000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'AddCountryToFeatures1763400001000');

COMMIT;

