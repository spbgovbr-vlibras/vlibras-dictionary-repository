export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Locations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    location: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
  });
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.dropTable('Locations');
}
