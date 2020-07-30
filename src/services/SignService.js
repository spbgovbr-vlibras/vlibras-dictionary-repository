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

      const sign = await models.Sign.create({ name: signName });

      await Promise.all([
        sign.addVersion(version),
        sign.addRegion(region),
        sign.addFormat(format),
        ...platforms.map(async (platform) => {
          await sign.addPlatform(platform);
        }),
      ]);

      return sign.get({ plain: true });
    } catch (registerNewSignError) {
      console.error(registerNewSignError); // TODO: change to logger
      if (registerNewSignError instanceof UniqueConstraintError) {
        throw new Error('sign already registered in the database');
      }
      throw new Error('an unexpected error occurred while registering sign');
    }
  }

  static async getRegisteredSign(signName, signVersion, signPlatform, signRegion = 'BR') {
    try {
      const sign = await models.Sign.findOne({
        where: {
          name: signName,
          '$Versions.version$': signVersion,
          '$Platforms.platform$': signPlatform,
          '$Regions.region$': signRegion,
          '$Formats.format$': 'BUNDLE',
        },
        include: [
          { model: models.Version, as: 'Versions' },
          { model: models.Platform, as: 'Platforms' },
          { model: models.Region, as: 'Regions' },
          { model: models.Format, as: 'Formats' },
        ],
      });

      if (sign !== null) {
        return sign.get({ plain: true });
      }

      return null;
    } catch (getRegisteredSignError) {
      console.error(getRegisteredSignError); // TODO: change to logger
      throw new Error('an unexpected error occurred while retrieving sign record');
    }
  }

  static async listRegisteredSigns() {
    try {
      const rows = await models.Sign.findAll({
        attributes: ['name'],
        include: [ // FIXME: try to remove relation table from query result
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
      const deletedCount = await models.Sign.destroy({ where: { name: signName } });
      return deletedCount;
    } catch (deleteSignRegisterError) {
      console.error(deleteSignRegisterError); // TODO: change to logger
      throw new Error('an unexpected error occurred while deleting sign record');
    }
  }
}
