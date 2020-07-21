import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert(
    'Versions',
    resources.versions.map((version) => ({
      ...version,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  );
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Versions', null, {});
}
