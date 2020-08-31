import { Model } from 'sequelize';

import sanitizer from '../util/sanitizer';

export default (sequelize, DataTypes) => {
  class Sign extends Model {
    static associate(models) {
      this.belongsToMany(models.Version, { through: 'SignVersions' });
      this.belongsToMany(models.Platform, { through: 'SignPlatforms' });
      this.belongsToMany(models.Region, { through: 'SignRegions' });
      this.belongsToMany(models.Format, { through: 'SignFormats' });
    }
  }

  Sign.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    subject: {
      type: DataTypes.STRING,
    },
    wordClass: {
      type: DataTypes.STRING,
    },
    nationality: {
      type: DataTypes.STRING,
    },
  }, {
    hooks: {
      beforeCreate: (instance) => {
        // eslint-disable-next-line no-param-reassign
        instance.name = sanitizer.toUpperCase(instance.name);
      },
    },
    sequelize,
    modelName: 'Sign',
    timestamps: true,
    paranoid: true,
  });

  return Sign;
};
