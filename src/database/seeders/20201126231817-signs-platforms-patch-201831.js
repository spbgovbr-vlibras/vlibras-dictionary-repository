import models from '../../models';

export async function up(queryInterface, _Sequelize) {
  const signs = await models.Sign.findAll({
    attributes: ['id'],
    include: [{ model: models.Platform }],
    where: { '$Platforms.platform$': null },
  });
  const platforms = await models.Platform.findAll({ attributes: ['id'] });

  const signsPlatforms = [];
  signs.forEach((sign) => {
    const signPlatforms = platforms.map((platform) => (
      { SignId: sign.get('id'), PlatformId: platform.get('id') }
    ));
    Array.prototype.push.apply(signsPlatforms, signPlatforms);
  });

  await queryInterface.bulkInsert('SignPlatforms', signsPlatforms);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('SignPlatforms', null, {});
}
