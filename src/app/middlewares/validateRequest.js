const util = require('util');
import createError from 'http-errors';
import { validationResult } from 'express-validator';

export default function validateRequest(req, _res, next) {
  console.log("validateRequest", (util.inspect(__filename, false, null, true)));
  const errors = validationResult(req);
  console.log("errors", (util.inspect(errors, false, null, true)));
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => `'${err.param}' ${err.msg}`);
    console.log("extractedErrors", (util.inspect(extractedErrors, false, null, true)));
    return next(createError(422, { validationErrors: extractedErrors }));
  }
  return next();
}
