import createError from 'http-errors';
import multer from 'multer';

import config from '../../config';
import constants from '../../lib/constants';
import validator from '../../lib/validator';

// TODO: implement a more robust file filter with file-type
// TODO: remember to change te filename to upper case
const upload = multer({
  dest: config.storage.fileStagingFolder,
  limits: { fileSize: config.storage.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (file.fieldname.toUpperCase() === constants.PLATFORMS.WIKILIBRAS) {
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
