import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveOwnerFromPlans1763900000000 implements MigrationInterface {
  name = 'RemoveOwnerFromPlans1763900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove owner column from plans table
    await queryRunner.dropColumn('plans', 'owner');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add owner column back (varchar(255), not null)
    await queryRunner.addColumn(
      'plans',
      new TableColumn({
        name: 'owner',
        type: 'varchar',
        length: '255',
        isNullable: false,
        default: "''",
      })
    );
  }
}

