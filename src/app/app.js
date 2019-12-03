import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../bundles')));

app.get('/', (_req, res, _next) => {
  res.status(200).send('Beam me up, Scotty!');
});

app.use((_req, _res, next) => {
  next(createError(404));
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  if (app.get('env') === 'dev') {
    console.error('\x1b[2m', err);
    res.json({ error: err });
  } else {
    res.json({ error: err.message });
  }
});

export default app;
