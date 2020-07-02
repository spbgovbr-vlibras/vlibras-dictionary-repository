export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('RegionPlatforms', {
    regionId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Region',
        key: 'id',
      },
    },
    platformId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
      references: {
        model: 'Platform',
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
  await queryInterface.dropTable('RegionPlatforms');
}
