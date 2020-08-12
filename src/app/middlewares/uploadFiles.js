import path from 'path';
import createError from 'http-errors';
import fse from 'fs-extra';
import multer from 'multer';

import config from '../../config';
import constants from '../../lib/constants';
import sanitizer from '../../lib/sanitizer';
import validator from '../../lib/validator';

// TODO: implement a more robust file filter with file-type
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!req.body.version) {
        return cb(createError(422, {
          param: 'version',
          value: req.body.version,
          msg: validator.errors.emptyError,
        }));
      }

      const destination = path.join(
        config.storage.fileStagingFolder,
        req.body.version,
        sanitizer.toUpperCase(file.fieldname),
        sanitizer.toUpperCase(req.body.region || constants.REGIONS.BR),
      );

      return fse.mkdirp(destination, (mkdirpError) => {
        if (mkdirpError !== null) {
          return cb(mkdirpError);
        }
        return cb(null, destination);
      });
    },
    filename: (_req, file, cb) => {
      const extname = path.extname(file.originalname);
      const basename = sanitizer.toUpperCase(path.basename(file.originalname, extname));
      cb(null, `${basename}${extname}`);
    },
  }),
  limits: { fileSize: config.storage.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (sanitizer.toUpperCase(file.fieldname) === constants.PLATFORMS.WIKILIBRAS) {
      const mimes = new RegExp(`^${Object.values(validator.values.mimes).join('|')}$`);
      if (mimes.test(file.mimetype)) {
        req.body[file.fieldname] = file.originalname;
        return cb(null, true);
      }

      return cb(createError(422, {
        param: file.fieldname,
        value: file.originalname,
        msg: validator.errors.mimeError,
      }));
    }

    const mimes = new RegExp(`^${validator.values.mimes.bin}$`);
    if (mimes.test(file.mimetype)) {
      req.body[file.fieldname] = file.originalname;
      return cb(null, true);
    }

    return cb(createError(422, {
      param: file.fieldname,
      value: file.originalname,
      msg: validator.errors.mimeError,
    }));
  },
});

export default upload.fields([
  { name: 'android', maxCount: 1 },
  { name: 'ios', maxCount: 1 },
  { name: 'linux', maxCount: 1 },
  { name: 'webgl', maxCount: 1 },
  { name: 'wikilibras', maxCount: 1 },
  { name: 'windows', maxCount: 1 },
]);
