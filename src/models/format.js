import { Model } from 'sequelize';

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
    sequelize,
    modelName: 'Format',
    timestamps: true,
  });

  return Format;
};
