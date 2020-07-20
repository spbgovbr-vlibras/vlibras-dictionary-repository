export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn(
    'Locations',
    'signId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  );
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.removeColumn('Locations', 'signId');
}
