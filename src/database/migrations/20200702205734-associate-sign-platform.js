export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SignPlatforms', {
    SignId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
      },
    },
    PlatformId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Platforms',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.dropTable('SignPlatforms');
}
