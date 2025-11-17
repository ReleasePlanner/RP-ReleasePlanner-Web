import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMilestoneColorToPlanReferences1763800000000 implements MigrationInterface {
  name = 'AddMilestoneColorToPlanReferences1763800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add milestoneColor column to plan_references table
    await queryRunner.addColumn(
      'plan_references',
      new TableColumn({
        name: 'milestoneColor',
        type: 'varchar',
        length: '7',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove milestoneColor column
    await queryRunner.dropColumn('plan_references', 'milestoneColor');
  }
}

