import { readdirSync, readJSONSync } from 'fs-extra';
import { basename, extname, join } from 'path';

const resources = {};

readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0)
    && (file !== basename(__filename))
    && (extname(file) === '.json'))
  .forEach((file) => {
    const resource = readJSONSync(join(__dirname, file));
    const resourceName = basename(file, '.json');
    resources[resourceName] = resource;
  });

export default resources;
