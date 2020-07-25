import { body } from 'express-validator';

import validator from '../../lib/validator';

const addNewSignRule = [
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
