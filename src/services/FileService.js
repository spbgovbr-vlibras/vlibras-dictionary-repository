import path from 'path';
import fse from 'fs-extra';

import config from '../config';
import constants from '../lib/constants';
import sanitizer from '../lib/sanitizer';

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

  static async removeSignFiles(sign, version, platform, region = 'BR', permanent = false) {
    // try {
    return null;
    // } catch (removeSignFilesError) {
    //   console.error(removeSignFilesError);
    //   throw new Error('an unexpected error occurred while removing sign files');
    // }
  }
}
