import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Versions', resources.versions);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Versions', null, {});
}
