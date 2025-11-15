-- Migration: AddCountryToCalendars (1763400002000)
-- Add countryId column to calendars table

BEGIN;

-- Add countryId column to calendars table
ALTER TABLE "calendars" 
ADD COLUMN IF NOT EXISTS "countryId" uuid NULL;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'FK_calendars_country'
  ) THEN
    ALTER TABLE "calendars" 
    ADD CONSTRAINT "FK_calendars_country" 
    FOREIGN KEY ("countryId") 
    REFERENCES "countries"("id") 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Register migration
INSERT INTO "migrations" ("timestamp", "name")
SELECT 1763400002000, 'AddCountryToCalendars1763400002000'
WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'AddCountryToCalendars1763400002000');

COMMIT;

