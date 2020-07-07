import path from 'path';
import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const environment = /^development$|^test$|^production$/.test(process.env.NODE_ENV)
  ? dotenv.config({ path: path.join(__dirname, `.env.${process.env.NODE_ENV}`) })
  : dotenv.config();

if (environment.error) {
  throw new Error(`Couldn't find environment file for NODE_ENV=${process.env.NODE_ENV}`);
}

export default {
  server: {
    ports: {
      http: parseInt(process.env.HTTP_PORT, 10) || 80,
      https: parseInt(process.env.HTTPS_PORT, 10) || 443,
    },
    ssl: {
      key: process.env.SSL_KEY,
      certificate: process.env.SSL_CERT,
    },
    logger: {
      format: process.env.LOGGER_FORMAT || 'combined',
    },
  },
  database: {
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASS || null,
    database: process.env.DATABASE_NAME || 'vlibrasdb',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    dialect: 'postgres',
  },
  api: {
    prefix: '/api',
  },
  node: {
    environment: process.env.NODE_ENV,
  },
};
