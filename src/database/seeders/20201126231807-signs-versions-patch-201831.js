import models from '../../models';

export async function up(queryInterface, _Sequelize) {
  const signs = await models.Sign.findAll({ attributes: ['id'] });
  const version = await models.Version.findOne({
    attributes: ['id'],
    where: { version: '2018.3.1' },
  });

  const signsVersion = signs.map((sign) => (
    { SignId: sign.get('id'), VersionId: version.get('id') }
  ));

  await queryInterface.bulkInsert('SignVersions', signsVersion);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('SignVersions', null, {});
}
