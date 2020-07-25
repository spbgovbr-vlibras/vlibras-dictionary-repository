import { Router } from 'express';

import { validateRequest, validationRules, uploadFile } from '../middlewares';
import { addNewSign } from '../controllers/signController';

const signRoute = Router();

export default (router) => {
  router.use('/signs', signRoute);

  signRoute.post(
    '/',
    uploadFile,
    validationRules.addNewSignRule,
    validateRequest,
    addNewSign,
  );
};
