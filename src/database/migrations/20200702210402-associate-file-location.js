export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn(
    'Locations',
    'fileId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'Files',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  );
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.removeColumn('Locations', 'fileId');
}
