import path from 'path';
import fse from 'fs-extra';

import config from '../config';
import constants from '../util/constants';
import sanitizer from '../util/sanitizer';

export default class FileService {
  static async publishSignFile(filePath, version, platform, region = 'BR', overwrite = false) {
    try {
      if (
        sanitizer.toUpperCase(platform) === constants.PLATFORMS.WIKILIBRAS
        && !(
          path.extname(filePath) === constants.EXTENSIONS.BLEND
          || path.extname(filePath) === constants.EXTENSIONS.VIDEO
        )
      ) {
        throw new Error(`${platform} files must be mp4 or blend`);
      }

      if (
        sanitizer.toUpperCase(platform) !== constants.PLATFORMS.WIKILIBRAS
        && path.extname(filePath) !== constants.EXTENSIONS.BUNDLE
      ) {
        throw new Error(`${platform} files must be bundle`);
      }

      const destination = path.join(
        config.storage.fileStorageFolder,
        version,
        sanitizer.toUpperCase(platform),
        sanitizer.toUpperCase(region),
        path.basename(filePath),
      );

      await fse.move(filePath, destination, { overwrite });
    } catch (publishSignFilesError) {
      console.error(publishSignFilesError);
      throw new Error('an unexpected error occurred while publishing sign files');
    }
  }

  static async retriveSignFile(fileName, version, platform, region = 'BR') {
    try {
      const signExtension = path.extname(fileName);
      const signName = path.basename(fileName, signExtension);

      const filePath = path.join(
        config.storage.fileStorageFolder,
        version,
        sanitizer.toUpperCase(platform),
        sanitizer.toUpperCase(region),
        `${sanitizer.toUpperCase(signName)}${signExtension}`,
      );

      const fileExists = await fse.pathExists(filePath);
      if (fileExists) {
        return filePath;
      }

      return null;
    } catch (retriveSignFileError) {
      console.error(retriveSignFileError);
      throw new Error('an unexpected error occurred while retrieving sign file');
    }
  }

  static async removeSignFiles(sign, version = '2018.3.1', region = 'BR', permanent = false) {
    return null;
    // try {
    // } catch (removeSignFilesError) {
    //   throw new Error('an unexpected error occurred while removing sign files');
    // }
  }
}
