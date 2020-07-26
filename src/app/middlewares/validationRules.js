import { body } from 'express-validator';

import validator from '../../lib/validator';

const addNewSignRule = [
  body('version')
    .isIn(validator.values.versions)
    .withMessage(validator.errors.versionError),
  body('region')
    .optional()
    .isIn(validator.values.regions)
    .withMessage(validator.errors.regionError),
  body('android')
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('ios')
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('linux')
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('webgl')
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('wikilibras')
    .optional()
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('windows')
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
];

export default {
  addNewSignRule,
};
