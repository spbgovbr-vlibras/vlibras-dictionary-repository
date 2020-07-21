import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert(
    'Platforms',
    resources.platforms.map((platform) => ({
      ...platform,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Platforms', null, {});
}
