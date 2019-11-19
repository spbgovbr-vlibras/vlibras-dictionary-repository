import path from 'path';
import dotenv from 'dotenv';

const loadEnvironments = function loadEnviromentVariables() {
  const environmentType = /^dev$|^production$/;
  if (environmentType.test(process.env.NODE_ENV)) {
    return path.join(__dirname, `.env.${process.env.NODE_ENV}`);
  }

  return path.join(__dirname, '.env.production');
};

const env = dotenv.config({ path: loadEnvironments() }).parsed;

export default env;
