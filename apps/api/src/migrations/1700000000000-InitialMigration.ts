import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000000 implements MigrationInterface {
  name = 'InitialMigration1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Base Phases
    await queryRunner.query(`
      CREATE TABLE "base_phases" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "color" VARCHAR(7) NOT NULL,
        "category" VARCHAR(100),
        CONSTRAINT "PK_base_phases" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_base_phases_name" ON "base_phases" ("name")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_base_phases_color" ON "base_phases" ("color")
    `);

    // Products
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_products_name" ON "products" ("name")
    `);

    // Component Versions
    await queryRunner.query(`
      CREATE TYPE "component_versions_type_enum" AS ENUM('web', 'services', 'mobile')
    `);
    await queryRunner.query(`
      CREATE TABLE "component_versions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "type" "component_versions_type_enum" NOT NULL,
        "currentVersion" VARCHAR(50) NOT NULL,
        "previousVersion" VARCHAR(50) NOT NULL,
        "productId" uuid NOT NULL,
        CONSTRAINT "PK_component_versions" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "component_versions" 
      ADD CONSTRAINT "FK_component_versions_product" 
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
    `);

    // Feature Categories
    await queryRunner.query(`
      CREATE TABLE "feature_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        CONSTRAINT "PK_feature_categories" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_feature_categories_name" ON "feature_categories" ("name")
    `);

    // Product Owners
    await queryRunner.query(`
      CREATE TABLE "product_owners" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        CONSTRAINT "PK_product_owners" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_product_owners_name" ON "product_owners" ("name")
    `);

    // Features
    await queryRunner.query(`
      CREATE TYPE "features_status_enum" AS ENUM('planned', 'in-progress', 'completed', 'on-hold')
    `);
    await queryRunner.query(`
      CREATE TABLE "features" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "categoryId" uuid NOT NULL,
        "status" "features_status_enum" NOT NULL DEFAULT 'planned',
        "createdById" uuid NOT NULL,
        "technicalDescription" TEXT NOT NULL,
        "businessDescription" TEXT NOT NULL,
        "productId" uuid NOT NULL,
        CONSTRAINT "PK_features" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_features_productId" ON "features" ("productId")
    `);
    await queryRunner.query(`
      ALTER TABLE "features" 
      ADD CONSTRAINT "FK_features_category" 
      FOREIGN KEY ("categoryId") REFERENCES "feature_categories"("id")
    `);
    await queryRunner.query(`
      ALTER TABLE "features" 
      ADD CONSTRAINT "FK_features_createdBy" 
      FOREIGN KEY ("createdById") REFERENCES "product_owners"("id")
    `);

    // Calendars
    await queryRunner.query(`
      CREATE TABLE "calendars" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        CONSTRAINT "PK_calendars" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_calendars_name" ON "calendars" ("name")
    `);

    // Calendar Days
    await queryRunner.query(`
      CREATE TYPE "calendar_days_type_enum" AS ENUM('holiday', 'special')
    `);
    await queryRunner.query(`
      CREATE TABLE "calendar_days" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "date" DATE NOT NULL,
        "type" "calendar_days_type_enum" NOT NULL,
        "description" TEXT,
        "recurring" BOOLEAN NOT NULL DEFAULT false,
        "calendarId" uuid NOT NULL,
        CONSTRAINT "PK_calendar_days" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_calendar_days_calendarId_date" ON "calendar_days" ("calendarId", "date")
    `);
    await queryRunner.query(`
      ALTER TABLE "calendar_days" 
      ADD CONSTRAINT "FK_calendar_days_calendar" 
      FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE CASCADE
    `);

    // IT Owners
    await queryRunner.query(`
      CREATE TABLE "it_owners" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        CONSTRAINT "PK_it_owners" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_it_owners_name" ON "it_owners" ("name")
    `);

    // Plans
    await queryRunner.query(`
      CREATE TYPE "plans_status_enum" AS ENUM('planned', 'in_progress', 'done', 'paused')
    `);
    await queryRunner.query(`
      CREATE TABLE "plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "owner" VARCHAR(255) NOT NULL,
        "startDate" DATE NOT NULL,
        "endDate" DATE NOT NULL,
        "status" "plans_status_enum" NOT NULL DEFAULT 'planned',
        "description" TEXT,
        "productId" uuid,
        "itOwner" uuid,
        "featureIds" jsonb NOT NULL DEFAULT '[]',
        "components" jsonb NOT NULL DEFAULT '[]',
        "calendarIds" jsonb NOT NULL DEFAULT '[]',
        CONSTRAINT "PK_plans" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plans_name" ON "plans" ("name")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plans_productId" ON "plans" ("productId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plans_itOwner" ON "plans" ("itOwner")
    `);

    // Plan Phases
    await queryRunner.query(`
      CREATE TABLE "plan_phases" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "startDate" DATE,
        "endDate" DATE,
        "color" VARCHAR(7),
        "planId" uuid NOT NULL,
        CONSTRAINT "PK_plan_phases" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plan_phases_planId" ON "plan_phases" ("planId")
    `);
    await queryRunner.query(`
      ALTER TABLE "plan_phases" 
      ADD CONSTRAINT "FK_plan_phases_plan" 
      FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE
    `);

    // Plan Tasks
    await queryRunner.query(`
      CREATE TABLE "plan_tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "title" VARCHAR(255) NOT NULL,
        "startDate" DATE NOT NULL,
        "endDate" DATE NOT NULL,
        "color" VARCHAR(7),
        "planId" uuid NOT NULL,
        CONSTRAINT "PK_plan_tasks" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plan_tasks_planId" ON "plan_tasks" ("planId")
    `);
    await queryRunner.query(`
      ALTER TABLE "plan_tasks" 
      ADD CONSTRAINT "FK_plan_tasks_plan" 
      FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE
    `);

    // Plan Milestones
    await queryRunner.query(`
      CREATE TABLE "plan_milestones" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "date" DATE NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "planId" uuid NOT NULL,
        CONSTRAINT "PK_plan_milestones" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plan_milestones_planId" ON "plan_milestones" ("planId")
    `);
    await queryRunner.query(`
      ALTER TABLE "plan_milestones" 
      ADD CONSTRAINT "FK_plan_milestones_plan" 
      FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE
    `);

    // Plan References
    await queryRunner.query(`
      CREATE TYPE "plan_references_type_enum" AS ENUM('link', 'document', 'note', 'comment', 'file', 'milestone')
    `);
    await queryRunner.query(`
      CREATE TABLE "plan_references" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "type" "plan_references_type_enum" NOT NULL,
        "title" VARCHAR(255) NOT NULL,
        "url" TEXT,
        "description" TEXT,
        "date" DATE,
        "phaseId" uuid,
        "planId" uuid NOT NULL,
        CONSTRAINT "PK_plan_references" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_plan_references_planId" ON "plan_references" ("planId")
    `);
    await queryRunner.query(`
      ALTER TABLE "plan_references" 
      ADD CONSTRAINT "FK_plan_references_plan" 
      FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE
    `);

    // Gantt Cell Data
    await queryRunner.query(`
      CREATE TABLE "gantt_cell_data" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "phaseId" uuid,
        "date" DATE NOT NULL,
        "isMilestone" BOOLEAN NOT NULL DEFAULT false,
        "milestoneColor" VARCHAR(7),
        "planId" uuid NOT NULL,
        CONSTRAINT "PK_gantt_cell_data" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_gantt_cell_data_planId_date" ON "gantt_cell_data" ("planId", "date")
    `);
    await queryRunner.query(`
      ALTER TABLE "gantt_cell_data" 
      ADD CONSTRAINT "FK_gantt_cell_data_plan" 
      FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE
    `);

    // Gantt Cell Comments
    await queryRunner.query(`
      CREATE TABLE "gantt_cell_comments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "text" TEXT NOT NULL,
        "author" VARCHAR(255) NOT NULL,
        "cellDataId" uuid NOT NULL,
        CONSTRAINT "PK_gantt_cell_comments" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "gantt_cell_comments" 
      ADD CONSTRAINT "FK_gantt_cell_comments_cellData" 
      FOREIGN KEY ("cellDataId") REFERENCES "gantt_cell_data"("id") ON DELETE CASCADE
    `);

    // Gantt Cell Files
    await queryRunner.query(`
      CREATE TABLE "gantt_cell_files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "url" TEXT NOT NULL,
        "size" BIGINT,
        "mimeType" VARCHAR(100),
        "cellDataId" uuid NOT NULL,
        CONSTRAINT "PK_gantt_cell_files" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "gantt_cell_files" 
      ADD CONSTRAINT "FK_gantt_cell_files_cellData" 
      FOREIGN KEY ("cellDataId") REFERENCES "gantt_cell_data"("id") ON DELETE CASCADE
    `);

    // Gantt Cell Links
    await queryRunner.query(`
      CREATE TABLE "gantt_cell_links" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "title" VARCHAR(255) NOT NULL,
        "url" TEXT NOT NULL,
        "description" TEXT,
        "cellDataId" uuid NOT NULL,
        CONSTRAINT "PK_gantt_cell_links" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "gantt_cell_links" 
      ADD CONSTRAINT "FK_gantt_cell_links_cellData" 
      FOREIGN KEY ("cellDataId") REFERENCES "gantt_cell_data"("id") ON DELETE CASCADE
    `);

    // Create function to update updatedAt timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updatedAt
    const tables = [
      'base_phases',
      'products',
      'component_versions',
      'feature_categories',
      'product_owners',
      'features',
      'calendars',
      'calendar_days',
      'it_owners',
      'plans',
      'plan_phases',
      'plan_tasks',
      'plan_milestones',
      'plan_references',
      'gantt_cell_data',
      'gantt_cell_comments',
      'gantt_cell_files',
      'gantt_cell_links',
    ];

    for (const table of tables) {
      await queryRunner.query(`
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON "${table}"
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    const tables = [
      'base_phases',
      'products',
      'component_versions',
      'feature_categories',
      'product_owners',
      'features',
      'calendars',
      'calendar_days',
      'it_owners',
      'plans',
      'plan_phases',
      'plan_tasks',
      'plan_milestones',
      'plan_references',
      'gantt_cell_data',
      'gantt_cell_comments',
      'gantt_cell_files',
      'gantt_cell_links',
    ];

    for (const table of tables) {
      await queryRunner.query(`DROP TRIGGER IF EXISTS update_${table}_updated_at ON "${table}"`);
    }

    // Drop function
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_updated_at_column()`);

    // Drop tables in reverse order (children first)
    await queryRunner.query(`DROP TABLE IF EXISTS "gantt_cell_links"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "gantt_cell_files"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "gantt_cell_comments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "gantt_cell_data"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plan_references"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plan_milestones"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plan_tasks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plan_phases"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "plans"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "it_owners"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "calendar_days"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "calendars"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "features"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product_owners"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "feature_categories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "component_versions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "base_phases"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS "plan_references_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "plans_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "calendar_days_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "features_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "component_versions_type_enum"`);
  }
}

