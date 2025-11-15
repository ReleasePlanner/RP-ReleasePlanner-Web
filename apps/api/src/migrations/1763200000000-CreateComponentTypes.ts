import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComponentTypes1763200000000 implements MigrationInterface {
  name = 'CreateComponentTypes1763200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create component_types table
    await queryRunner.query(`
      CREATE TABLE "component_types" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "name" VARCHAR(255) NOT NULL,
        "code" VARCHAR(100) NULL,
        "description" TEXT NULL,
        CONSTRAINT "PK_component_types" PRIMARY KEY ("id")
      )
    `);
    
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_component_types_name" ON "component_types" ("name")
    `);
    
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_component_types_code" ON "component_types" ("code") WHERE "code" IS NOT NULL
    `);

    // Insert default component types
    await queryRunner.query(`
      INSERT INTO "component_types" ("name", "code", "description") VALUES
      ('Web', 'web', 'Web-based applications and frontends'),
      ('Services', 'services', 'Backend services and APIs'),
      ('Mobile', 'mobile', 'Mobile applications (iOS, Android)')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_component_types_code"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_component_types_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "component_types"`);
  }
}

