import { body, param } from 'express-validator';

import sanitizer from '../../lib/sanitizer';
import validator from '../../lib/validator';

const addSignRule = [
  body('version')
    .isIn(validator.values.versions)
    .withMessage(validator.errors.versionError),
  body('region')
    .optional()
    .customSanitizer(sanitizer.toUpperCase)
    .isIn(validator.values.regions)
    .withMessage(validator.errors.regionError),
  body('android')
    .if((_value, { req }) => {
      const platforms = [req.body.ios, req.body.linux, req.body.webgl, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .bail()
    .withMessage(validator.errors.fileError)
    .custom((value, { req }) => {
      const platforms = [req.body.ios, req.body.linux, req.body.webgl, req.body.windows];
      return platforms.every((element) => element === value);
    })
    .withMessage(validator.errors.divergenceError),
  body('ios')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.linux, req.body.webgl, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .bail()
    .withMessage(validator.errors.fileError)
    .custom((value, { req }) => {
      const platforms = [req.body.android, req.body.linux, req.body.webgl, req.body.windows];
      return platforms.every((element) => element === value);
    })
    .withMessage(validator.errors.divergenceError),
  body('linux')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.webgl, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .bail()
    .withMessage(validator.errors.fileError)
    .custom((value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.webgl, req.body.windows];
      return platforms.every((element) => element === value);
    })
    .withMessage(validator.errors.divergenceError),
  body('webgl')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.linux, req.body.windows];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .bail()
    .withMessage(validator.errors.fileError)
    .custom((value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.linux, req.body.windows];
      return platforms.every((element) => element === value);
    })
    .withMessage(validator.errors.divergenceError),
  body('windows')
    .if((_value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.linux, req.body.webgl];
      return !req.body.wikilibras || platforms.some((element) => element);
    })
    .not().isEmpty()
    .bail()
    .withMessage(validator.errors.fileError)
    .custom((value, { req }) => {
      const platforms = [req.body.android, req.body.ios, req.body.linux, req.body.webgl];
      return platforms.every((element) => element === value);
    })
    .withMessage(validator.errors.divergenceError),
  body('wikilibras')
    .optional()
    .not().isEmpty()
    .bail()
    .withMessage(validator.errors.fileError)
    .custom((value, { req }) => {
      const platforms = [
        req.body.android,
        req.body.ios,
        req.body.linux,
        req.body.webgl,
        req.body.windows,
      ];
      return platforms.every((element) => !element || element === value.split('.')[0]);
    })
    .withMessage(validator.errors.divergenceError),
];

const getSignRule = [
  param('sign')
    .not().isEmpty()
    .customSanitizer(sanitizer.toUpperCase)
    .withMessage(validator.errors.emptyError),
  param('version')
    .isIn(validator.values.versions)
    .withMessage(validator.errors.versionError),
  param('platform')
    .customSanitizer(sanitizer.toUpperCase)
    .isIn(validator.values.platforms)
    .withMessage(validator.errors.platformError),
  param('region')
    .optional()
    .customSanitizer(sanitizer.toUpperCase)
    .isIn(validator.values.regions)
    .withMessage(validator.errors.regionError),
];

const removeSignRule = param('sign')
  .not().isEmpty()
  .customSanitizer(sanitizer.toUpperCase)
  .withMessage(validator.errors.emptyError);

export default {
  addSignRule,
  getSignRule,
  removeSignRule,
};
