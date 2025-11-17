import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhaseIdToPlanMilestones1763700000000 implements MigrationInterface {
  name = 'AddPhaseIdToPlanMilestones1763700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add phaseId column to plan_milestones table
    await queryRunner.addColumn(
      'plan_milestones',
      new TableColumn({
        name: 'phaseId',
        type: 'uuid',
        isNullable: true,
      })
    );

    // Add index for phaseId for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_plan_milestones_phaseId" ON "plan_milestones" ("phaseId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_plan_milestones_phaseId"
    `);

    // Remove phaseId column
    await queryRunner.dropColumn('plan_milestones', 'phaseId');
  }
}

