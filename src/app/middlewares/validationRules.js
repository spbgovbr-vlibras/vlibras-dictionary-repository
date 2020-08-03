import { body, param } from 'express-validator';

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
    .if((_value, { req }) => {
      const platforms = [req.body.ios, req.body.linux, req.body.webgl, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('ios')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.linux, req.body.webgl, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('linux')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.webgl, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('webgl')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.linux, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('windows')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.linux, req.body.webgl];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
  body('wikilibras')
    .optional()
    .not().isEmpty()
    .withMessage(validator.errors.fileError),
];

const getSignRule = [
  param('sign')
    .not().isEmpty()
    .withMessage(validator.errors.emptyError),
  param('version')
    .isIn(validator.values.versions)
    .withMessage(validator.errors.versionError),
  param('platform')
    .isIn(validator.values.platforms)
    .withMessage(validator.errors.platformError),
  param('region')
    .optional()
    .isIn(validator.values.regions)
    .withMessage(validator.errors.regionError),
];

const removeSignRule = param('sign')
  .not().isEmpty()
  .withMessage(validator.errors.emptyError);

export default {
  addNewSignRule,
  getSignRule,
  removeSignRule,
};
