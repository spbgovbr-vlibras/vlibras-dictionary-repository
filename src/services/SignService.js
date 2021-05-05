const util = require('util');
import path from 'path';
import { Op } from 'sequelize';

import models from '../models';
import constants from '../util/constants';

export default class SignService {
  static async registerNewSignBundle(signName, signVersion, signRegion = 'BR') {
    try {
      console.log("registerNewSignBundle", (util.inspect(__filename, false, null, true)));

      const [version, platforms, region, format] = await Promise.all([
        models.Version.findOne({ where: { version: signVersion } }),
        models.Platform.findAll({
          where: { platform: { [Op.not]: constants.PLATFORMS.WIKILIBRAS } },
        }),
        models.Region.findOne({ where: { region: signRegion } }),
        models.Format.findOne({ where: { format: constants.FORMATS.BUNDLE } }),
      ]); // do not change the sequence

      console.log("version", (util.inspect(version, false, null, true)));
      console.log("platforms", (util.inspect(platforms, false, null, true)));
      console.log("region", (util.inspect(region, false, null, true)));
      console.log("format", (util.inspect(format, false, null, true)));

      // TODO: include sign metadata when create
      const [sign] = await models.Sign.findCreateFind({
        where: { name: signName, patch: '201831' },
        paranoid: false,
      });

      if (sign.dataValues.deletedAt !== null) {
        await sign.restore();
      }

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
      console.log("registerNewSignSource", (util.inspect(__filename, false, null, true)));
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

      console.log("sign", (util.inspect(sign, false, null, true)));

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
          name: path.basename(signName, path.extname(signName)),
          '$Versions.version$': signVersion,
          '$Platforms.platform$': signPlatform,
          '$Regions.region$': signRegion,
          '$Formats.extension$': path.extname(signName),
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

  static async listRegisteredSigns(signsVersion = '2018.3.1') {
    try {
      console.log("listRegisteredSigns", (util.inspect(__filename, false, null, true)));
      console.log("signsVersion", (util.inspect(signsVersion, false, null, true)));
      const rows = await models.Sign.findAll({
        attributes: ['name'],
        where: { '$Versions.version$': signsVersion },
        include: [{ model: models.Version, as: 'Versions' }],
        order: [['id', 'ASC']],
      });
      // console.log("rows", (util.inspect(rows, false, null, true)));

      const signs = rows.map((row) => row.get({ plain: true }).name);
      // console.log("signs", (util.inspect(signs, false, null, true)));

      return signs;
    } catch (listRegisteredSignsError) {
      // console.log("listRegisteredSignsError", (util.inspect(listRegisteredSignsError, false, null, true)));
      console.error(listRegisteredSignsError); // TODO: change to logger
      throw new Error('an unexpected error occurred while fetching the sign list');
    }
  }

  static async deleteSignRegister(signName) {
    try {
      const deletedCount = await models.Sign.destroy({ where: { name: signName } });
      console.log("deletedCount", (util.inspect(deletedCount, false, null, true)));
      return deletedCount;
    } catch (deleteSignRegisterError) {
      console.log("deleteSignRegisterError", (util.inspect(deleteSignRegisterError, false, null, true)));
      console.error(deleteSignRegisterError); // TODO: change to logger
      throw new Error('an unexpected error occurred while deleting sign record');
    }
  }
}
