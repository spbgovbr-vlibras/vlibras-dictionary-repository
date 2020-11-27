import models from '../../models';

export async function up(queryInterface, _Sequelize) {
  const signs = await models.Sign.findAll({
    attributes: ['id'],
    include: [{ model: models.Region }],
    where: { '$Regions.region$': null },
  });
  const region = await models.Region.findOne({ attributes: ['id'], where: { region: 'BR' } });

  const signsRegion = signs.map((sign) => (
    { SignId: sign.get('id'), RegionId: region.get('id') }
  ));

  await queryInterface.bulkInsert('SignRegions', signsRegion);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('SignRegions', null, {});
}
