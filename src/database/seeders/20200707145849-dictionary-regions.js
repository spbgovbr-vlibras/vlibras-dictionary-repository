export async function up(queryInterface, _Sequelize) {
  await queryInterface.bulkInsert('Regions', [
    {
      region: 'BR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'AC',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'AL',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'AP',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'AM',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'BA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'CE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'DF',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'ES',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'GO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'MA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'MT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'MS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'MG',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'PA',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'PB',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'PR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'PE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'PI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'RJ',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'RN',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'RS',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'RO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'RR',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'SC',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'SP',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'SE',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      region: 'TO',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('Regions', null, {});
}
