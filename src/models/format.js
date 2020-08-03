import { Model } from 'sequelize';

import sanitizer from '../lib/sanitizer';

export default (sequelize, DataTypes) => {
  class Format extends Model {
    static associate(models) {
      this.belongsToMany(models.Sign, { through: 'SignFormats' });
    }
  }

  Format.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    format: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    extension: {
      allowNull: true,
      type: DataTypes.STRING,
    },
  }, {
    hooks: {
      beforeCreate: (instance) => {
        // eslint-disable-next-line no-param-reassign
        instance.format = sanitizer.toUpperCase(instance.format);
      },
    },
    sequelize,
    modelName: 'Format',
    timestamps: false,
  });

  return Format;
};
