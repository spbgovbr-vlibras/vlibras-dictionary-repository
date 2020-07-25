import { Router } from 'express';

import signRoute from './signRoute';

export default () => {
  const router = Router();
  signRoute(router);

  return router;
};
