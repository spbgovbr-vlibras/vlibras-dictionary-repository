import { Router } from 'express';

import { validateRequest, validationRules, uploadFiles } from '../middlewares';
import { addNewSign } from '../controllers/signController';

const signRoute = Router();

export default (router) => {
  router.use('/signs', signRoute);

  signRoute.post(
    '/',
    uploadFiles,
    validationRules.addNewSignRule,
    validateRequest,
    addNewSign,
  );
};
