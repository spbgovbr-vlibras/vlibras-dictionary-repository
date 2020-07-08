/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { readdirSync } from 'fs';
import { basename, join } from 'path';
import Sequelize from 'sequelize';
import sequelize from '../database';

const models = {};

readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0)
    && (file !== basename(__filename))
    && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = require(join(__dirname, file)).default(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

Object.keys(models).forEach((model) => {
  if (models[model].associate) {
    models[model].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
