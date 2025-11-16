import { MigrationInterface, QueryRunner, Table, Index, ForeignKey } from 'typeorm';

export class CreatePlanComponentVersions1763600000000 implements MigrationInterface {
  name = 'CreatePlanComponentVersions1763600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create plan_component_versions table
    await queryRunner.createTable(
      new Table({
        name: 'plan_component_versions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'planId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'productId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'componentId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'oldVersion',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'newVersion',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
        ],
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndex(
      'plan_component_versions',
      new Index('IDX_plan_component_versions_planId', ['planId'])
    );

    await queryRunner.createIndex(
      'plan_component_versions',
      new Index('IDX_plan_component_versions_productId', ['productId'])
    );

    await queryRunner.createIndex(
      'plan_component_versions',
      new Index('IDX_plan_component_versions_componentId', ['componentId'])
    );

    await queryRunner.createIndex(
      'plan_component_versions',
      new Index('IDX_plan_component_versions_planId_componentId', ['planId', 'componentId'])
    );

    // Create foreign key to plans table
    await queryRunner.createForeignKey(
      'plan_component_versions',
      new ForeignKey({
        columnNames: ['planId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plans',
        onDelete: 'CASCADE',
        name: 'FK_plan_component_versions_planId',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key
    await queryRunner.dropForeignKey(
      'plan_component_versions',
      'FK_plan_component_versions_planId'
    );

    // Drop indexes
    await queryRunner.dropIndex('plan_component_versions', 'IDX_plan_component_versions_planId_componentId');
    await queryRunner.dropIndex('plan_component_versions', 'IDX_plan_component_versions_componentId');
    await queryRunner.dropIndex('plan_component_versions', 'IDX_plan_component_versions_productId');
    await queryRunner.dropIndex('plan_component_versions', 'IDX_plan_component_versions_planId');

    // Drop table
    await queryRunner.dropTable('plan_component_versions');
  }
}

