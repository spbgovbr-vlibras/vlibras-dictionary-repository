export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Versions', [
    {
      version: '2018.3.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      version: '2018.3.1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Versions', null, {});
}
