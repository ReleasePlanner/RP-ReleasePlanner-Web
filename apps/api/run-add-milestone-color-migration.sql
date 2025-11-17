-- Migration: Add milestoneColor column to plan_references table
-- Migration ID: 1763800000000-AddMilestoneColorToPlanReferences

-- Add milestoneColor column to plan_references table
ALTER TABLE "plan_references" 
ADD COLUMN IF NOT EXISTS "milestoneColor" VARCHAR(7) NULL;

-- Migration completed successfully

