import { UniqueConstraintError } from 'sequelize';
import models from '../models';

export default class SignService {
  static async registerNewSign(signName, signVersion, signRegion = 'BR') {
    try {
      const [version, platforms, region, format] = await Promise.all([
        models.Version.findOne({ where: { version: signVersion } }),
        models.Platform.findAll(),
        models.Region.findOne({ where: { region: signRegion } }),
        models.Format.findOne({ where: { format: 'BUNDLE' } }),
      ]); // do not change the sequence

      const bundle = await models.Sign.create({ name: signName });

      await Promise.all([
        bundle.addVersion(version),
        bundle.addRegion(region),
        bundle.addFormat(format),
        ...platforms.map(async (platform) => {
          await bundle.addPlatform(platform);
        }),
      ]);

      return bundle.get({ plain: true });
    } catch (registerNewSignError) {
      console.error(registerNewSignError); // TODO: change to logger
      if (registerNewSignError instanceof UniqueConstraintError) {
        throw new Error('sign already registered in the database');
      }
      throw new Error('an unexpected error occurred while registering sign');
    }
  }

  static async listRegisteredSigns() {
    try {
      const rows = await models.Sign.findAll({
        attributes: ['name'],
        include: [
          { model: models.Version, attributes: ['version'] },
          { model: models.Platform, attributes: ['platform'] },
          { model: models.Region, attributes: ['region'] },
          { model: models.Format, attributes: ['format'] },
        ],
      });

      const signs = rows.map((row) => row.get({ plain: true }));
      return signs;
    } catch (listRegisteredSignsError) {
      console.error(listRegisteredSignsError); // TODO: change to logger
      throw new Error('an unexpected error occurred while fetching the sign list');
    }
  }

  static async deleteSignRegister(signName) {
    try {
      models.Sign.destroy({ where: { name: signName } });
    } catch (deleteSignRegisterError) {
      console.error(deleteSignRegisterError); // TODO: change to logger
      throw new Error('an unexpected error occurred while deleting sign record');
    }
  }
}
