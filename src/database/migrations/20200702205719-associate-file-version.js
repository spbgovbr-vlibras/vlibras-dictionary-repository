export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('FileVersions', {
    fileId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'File',
        key: 'id',
      },
    },
    versionId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
      references: {
        model: 'Version',
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
  await queryInterface.dropTable('FileVersions');
}