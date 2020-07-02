export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Platforms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    platform: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
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
  await queryInterface.dropTable('Platforms');
}