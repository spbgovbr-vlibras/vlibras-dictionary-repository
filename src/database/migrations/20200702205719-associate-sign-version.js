export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SignVersions', {
    SignId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
      },
    },
    VersionId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Versions',
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
  await queryInterface.dropTable('SignVersions');
}
