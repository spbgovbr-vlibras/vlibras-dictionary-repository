export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('SignFormats', {
    SignId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Signs',
        key: 'id',
      },
    },
    FormatId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Formats',
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
  await queryInterface.dropTable('SignFormats');
}