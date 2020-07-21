import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Platforms', resources.platforms);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Platforms', null, {});
}
