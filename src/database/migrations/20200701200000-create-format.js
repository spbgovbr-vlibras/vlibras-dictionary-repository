export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Formats', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    format: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    extension: {
      allowNull: true,
      type: Sequelize.STRING,
    },
  });
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.dropTable('Formats');
}
