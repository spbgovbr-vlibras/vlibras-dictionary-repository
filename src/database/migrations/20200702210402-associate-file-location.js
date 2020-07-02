export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn(
    'Location',
    'fileId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'File',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  );
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.removeColumn('Location', 'fileId');
}
