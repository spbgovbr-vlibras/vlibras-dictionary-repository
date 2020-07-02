import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class File extends Model {
    associate(models) {
      this.belongsToMany(models.Version, { through: 'FileVersions' });
      this.belongsToMany(models.Platform, { through: 'FilePlatforms' });
      this.belongsToMany(models.Region, { through: 'FileRegions' });
      this.belongsToMany(models.Format, { through: 'FileFormats' });
      this.hasMany(models.Location);
    }
  }

  File.init({
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
  }, {
    sequelize,
    modelName: 'File',
    timestamps: true,
  });

  return File;
};
