export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Platforms', [
    {
      platform: 'ANDROID',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: 'IOS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: 'LINUX',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: 'WINDOWS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: 'WEBGL',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: 'WIKILIBRAS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Platforms', null, {});
}
