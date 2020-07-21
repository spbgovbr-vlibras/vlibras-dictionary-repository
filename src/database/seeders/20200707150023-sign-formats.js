import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Formats', resources.formats);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Formats', null, {});
}
