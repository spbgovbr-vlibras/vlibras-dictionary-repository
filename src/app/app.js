import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';

import config from '../config';
import routes from './routes';

const app = express();

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(logger(config.server.logger));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(config.api.prefix, routes());

app.use((_req, _res, next) => {
  next(createError(404));
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);

  if (app.get('env') === 'development') {
    return res.json({ error: err.status === 422 ? err : { message: err.stack } });
  }

  return res.json({ error: err.status === 422 ? err : { message: err.message } });
});

export default app;
