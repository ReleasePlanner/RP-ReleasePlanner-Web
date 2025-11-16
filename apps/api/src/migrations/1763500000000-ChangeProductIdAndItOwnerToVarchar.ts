import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeProductIdAndItOwnerToVarchar1763500000000
  implements MigrationInterface
{
  name = 'ChangeProductIdAndItOwnerToVarchar1763500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change productId from UUID to VARCHAR
    // Handle NULL values and convert UUIDs to strings
    await queryRunner.query(`
      ALTER TABLE plans
      ALTER COLUMN "productId" TYPE VARCHAR(255) 
      USING CASE 
        WHEN "productId" IS NULL THEN NULL 
        ELSE "productId"::TEXT 
      END;
    `);

    // Change itOwner from UUID to VARCHAR
    // Handle NULL values and convert UUIDs to strings
    await queryRunner.query(`
      ALTER TABLE plans
      ALTER COLUMN "itOwner" TYPE VARCHAR(255) 
      USING CASE 
        WHEN "itOwner" IS NULL THEN NULL 
        ELSE "itOwner"::TEXT 
      END;
    `);

    // Register migration
    await queryRunner.query(`
      INSERT INTO "migrations" ("timestamp", "name")
      SELECT 1763500000000, 'ChangeProductIdAndItOwnerToVarchar1763500000000'
      WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'ChangeProductIdAndItOwnerToVarchar1763500000000')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert productId back to UUID (only if values are valid UUIDs)
    await queryRunner.query(`
      ALTER TABLE plans
      ALTER COLUMN "productId" TYPE UUID 
      USING CASE 
        WHEN "productId" IS NULL OR "productId" = '' THEN NULL 
        WHEN "productId" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN "productId"::UUID
        ELSE NULL
      END;
    `);

    // Revert itOwner back to UUID (only if values are valid UUIDs)
    await queryRunner.query(`
      ALTER TABLE plans
      ALTER COLUMN "itOwner" TYPE UUID 
      USING CASE 
        WHEN "itOwner" IS NULL OR "itOwner" = '' THEN NULL 
        WHEN "itOwner" ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN "itOwner"::UUID
        ELSE NULL
      END;
    `);
  }
}

