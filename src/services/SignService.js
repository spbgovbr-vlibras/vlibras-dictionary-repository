import { Op } from 'sequelize';

import models from '../models';
import constants from '../lib/constants';

export default class SignService {
  static async registerNewSignBundle(signName, signVersion, signRegion = 'BR') {
    try {
      const [version, platforms, region, format] = await Promise.all([
        models.Version.findOne({ where: { version: signVersion } }),
        models.Platform.findAll({
          where: { platform: { [Op.not]: constants.PLATFORMS.WIKILIBRAS } },
        }),
        models.Region.findOne({ where: { region: signRegion } }),
        models.Format.findOne({ where: { format: constants.FORMATS.BUNDLE } }),
      ]); // do not change the sequence

      // TODO: include sign metadata when create
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
      throw new Error('an unexpected error occurred while registering sign bundle');
    }
  }

  static async registerNewSignSource(signName, signVersion, signExtension, signRegion = 'BR') {
    try {
      const sign = await models.Sign.findOne({
        where: {
          name: signName,
          '$Versions.version$': signVersion,
          '$Regions.region$': signRegion,
        },
        include: [
          { model: models.Version, as: 'Versions' },
          { model: models.Platform, attributes: ['platform'] },
          { model: models.Region, as: 'Regions' },
          { model: models.Format, attributes: ['extension'] },
        ],
      });

      if (sign === null) {
        throw new Error('no sign record in the database to associate the sign source');
      }

      const { Platforms, Formats } = sign.get({ plain: true });
      if (
        Platforms.some((platform) => platform.platform === constants.PLATFORMS.WIKILIBRAS)
        && Formats.some((format) => format.extension === signExtension)
      ) {
        throw new Error('sign source already registered in the database');
      }

      const [platform, format] = await Promise.all([
        models.Platform.findOne({ where: { platform: constants.PLATFORMS.WIKILIBRAS } }),
        models.Format.findOne({ where: { extension: signExtension } }),
      ]); // do not change the sequence

      await Promise.all([
        sign.addFormat(format),
        sign.addPlatform(platform),
      ]);

      return sign.get({ plain: true });
    } catch (registerNewSignSourceError) {
      console.error(registerNewSignSourceError); // TODO: change to logger
      throw new Error('an unexpected error occurred while registering sign source');
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

      if (sign === null) {
        return null;
      }

      return sign.get({ plain: true });
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
