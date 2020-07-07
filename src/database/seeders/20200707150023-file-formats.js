export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Formats', [
    {
      format: 'blend',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      format: 'bundle',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      format: 'mp4',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Formats', null, {});
}
