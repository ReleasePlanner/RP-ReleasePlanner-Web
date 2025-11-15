import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCountries1763400000000 implements MigrationInterface {
  name = 'CreateCountries1763400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create countries table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "countries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "name" VARCHAR(255) NOT NULL,
        "code" VARCHAR(10) NOT NULL,
        "isoCode" VARCHAR(10) NULL,
        "region" VARCHAR(255) NULL,
        CONSTRAINT "PK_countries" PRIMARY KEY ("id")
      )
    `);

    // Create unique indexes
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_countries_name" ON "countries" ("name")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_countries_code" ON "countries" ("code")
    `);

    // Insert default countries
    const defaultCountries = [
      { name: 'United States', code: 'US', isoCode: 'USA', region: 'North America' },
      { name: 'Canada', code: 'CA', isoCode: 'CAN', region: 'North America' },
      { name: 'Mexico', code: 'MX', isoCode: 'MEX', region: 'North America' },
      { name: 'United Kingdom', code: 'GB', isoCode: 'GBR', region: 'Europe' },
      { name: 'Germany', code: 'DE', isoCode: 'DEU', region: 'Europe' },
      { name: 'France', code: 'FR', isoCode: 'FRA', region: 'Europe' },
      { name: 'Spain', code: 'ES', isoCode: 'ESP', region: 'Europe' },
      { name: 'Italy', code: 'IT', isoCode: 'ITA', region: 'Europe' },
      { name: 'Brazil', code: 'BR', isoCode: 'BRA', region: 'South America' },
      { name: 'Argentina', code: 'AR', isoCode: 'ARG', region: 'South America' },
      { name: 'Chile', code: 'CL', isoCode: 'CHL', region: 'South America' },
      { name: 'Colombia', code: 'CO', isoCode: 'COL', region: 'South America' },
      { name: 'Peru', code: 'PE', isoCode: 'PER', region: 'South America' },
      { name: 'China', code: 'CN', isoCode: 'CHN', region: 'Asia' },
      { name: 'Japan', code: 'JP', isoCode: 'JPN', region: 'Asia' },
      { name: 'India', code: 'IN', isoCode: 'IND', region: 'Asia' },
      { name: 'Australia', code: 'AU', isoCode: 'AUS', region: 'Oceania' },
    ];

    for (const country of defaultCountries) {
      await queryRunner.query(`
        INSERT INTO "countries" ("name", "code", "isoCode", "region")
        SELECT $1, $2, $3, $4
        WHERE NOT EXISTS (SELECT 1 FROM "countries" WHERE "code" = $2)
      `, [country.name, country.code, country.isoCode, country.region]);
    }

    // Register migration
    await queryRunner.query(`
      INSERT INTO "migrations" ("timestamp", "name")
      SELECT 1763400000000, 'CreateCountries1763400000000'
      WHERE NOT EXISTS (SELECT 1 FROM "migrations" WHERE "name" = 'CreateCountries1763400000000')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_countries_code"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_countries_name"`);
    
    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "countries"`);
  }
}

