import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Sign extends Model {
    static associate(models) {
      this.belongsToMany(models.Version, { through: 'SignVersions' });
      this.belongsToMany(models.Platform, { through: 'SignPlatforms' });
      this.belongsToMany(models.Region, { through: 'SignRegions' });
      this.belongsToMany(models.Format, { through: 'SignFormats' });
      this.belongsToMany(models.Location, { through: 'SignLocations' });
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
  }, {
    sequelize,
    modelName: 'Sign',
    timestamps: true,
  });

  return Sign;
};
