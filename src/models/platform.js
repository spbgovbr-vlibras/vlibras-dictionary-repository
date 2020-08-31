import { Model } from 'sequelize';

import sanitizer from '../util/sanitizer';

export default (sequelize, DataTypes) => {
  class Platform extends Model {
    static associate(models) {
      this.belongsToMany(models.Sign, { through: 'SignPlatforms' });
    }
  }

  Platform.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    platform: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    hooks: {
      beforeCreate: (instance) => {
        // eslint-disable-next-line no-param-reassign
        instance.platform = sanitizer.toUpperCase(instance.platform);
      },
    },
    sequelize,
    modelName: 'Platform',
    timestamps: false,
  });

  return Platform;
};
