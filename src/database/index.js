import Sequelize from 'sequelize';

import clientConfig from './cli/config';

export default new Sequelize(Object.values(clientConfig)[0]);
