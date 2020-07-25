import createError from 'http-errors';
import { validationResult } from 'express-validator';

export default function validateRequest(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => `'${err.param}' ${err.msg}`);
    return next(createError(422, { validationErrors: extractedErrors }));
  }
  return next();
}
