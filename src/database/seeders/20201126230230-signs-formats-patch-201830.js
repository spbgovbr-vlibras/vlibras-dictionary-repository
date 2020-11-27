import models from '../../models';

export async function up(queryInterface, _Sequelize) {
  const signs = await models.Sign.findAll({ attributes: ['id'] });
  const formats = await models.Format.findAll({ attributes: ['id'] });

  const signsFormats = [];
  signs.forEach((sign) => {
    const signFormats = formats.map((format) => (
      { SignId: sign.get('id'), FormatId: format.get('id') }
    ));
    Array.prototype.push.apply(signsFormats, signFormats);
  });

  await queryInterface.bulkInsert('SignFormats', signsFormats);
}

export async function down(queryInterface, _Sequelize) {
  await queryInterface.bulkDelete('SignFormats', null, {});
}
