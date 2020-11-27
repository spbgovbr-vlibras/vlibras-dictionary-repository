import resources from '../resources';

export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Signs', resources.signspatch201830);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Signs', null, {});
}
