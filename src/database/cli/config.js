import config from '../../config';

/* use module.exports for the sequelize-cli to work */
module.exports = {
  [config.node.environment]: config.database,
};
