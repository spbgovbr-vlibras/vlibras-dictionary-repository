import { Router } from 'express';

import { validateRequest, validationRules, uploadFiles } from '../middlewares';
import { addNewSign, listSigns, removeSign } from '../controllers/signController';

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

  signRoute.get(
    '/',
    listSigns,
  );

  signRoute.delete(
    '/:sign',
    validationRules.removeSignRule,
    validateRequest,
    removeSign,
  );
};
