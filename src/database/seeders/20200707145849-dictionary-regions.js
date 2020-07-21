import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Regions', resources.regions);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Regions', null, {});
}
