import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Platform extends Model {
    static associate(models) {
      this.belongsToMany(models.File, { through: 'FilePlatforms' });
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
    sequelize,
    modelName: 'Platform',
    timestamps: true,
  });

  return Platform;
};
