import { Model } from 'sequelize';

import sanitizer from '../util/sanitizer';

export default (sequelize, DataTypes) => {
  class Region extends Model {
    static associate(models) {
      this.belongsToMany(models.Sign, { through: 'SignRegions' });
    }
  }

  Region.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    region: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    hooks: {
      beforeCreate: (instance) => {
        // eslint-disable-next-line no-param-reassign
        instance.region = sanitizer.toUpperCase(instance.region);
      },
    },
    sequelize,
    modelName: 'Region',
    timestamps: false,
  });

  return Region;
};
