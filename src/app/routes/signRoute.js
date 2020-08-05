import { Router } from 'express';

import { validateRequest, validationRules, uploadFiles } from '../middlewares';

import {
  addNewSign, getSign, listSigns, removeSign,
} from '../controllers/signController';

const signRoute = Router();

export default (router) => {
  router.use('/signs', signRoute);

  signRoute.post(
    '/',
    uploadFiles,
    validationRules.addSignRule,
    validateRequest,
    addNewSign,
  );

  signRoute.get(
    '/:version/:platform/:region?/:sign',
    validationRules.getSignRule,
    validateRequest,
    getSign,
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
