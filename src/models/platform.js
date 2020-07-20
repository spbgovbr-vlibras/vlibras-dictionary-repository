import { Model } from 'sequelize';

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
    sequelize,
    modelName: 'Platform',
    timestamps: true,
  });

  return Platform;
};
