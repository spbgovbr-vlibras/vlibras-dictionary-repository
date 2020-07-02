import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Version extends Model {
    associate(models) {
      this.belongsToMany(models.Platform, { through: 'PlatformVersions' });
      this.belongsToMany(models.File, { through: 'FileVersions' });
    }
  }

  Version.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    version: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Version',
    timestamps: true,
  });

  return Version;
};
