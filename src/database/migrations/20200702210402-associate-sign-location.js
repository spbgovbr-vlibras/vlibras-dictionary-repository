export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SignLocations', {
    SignId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
      },
    },
    LocationId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.dropTable('SignLocations');
}
