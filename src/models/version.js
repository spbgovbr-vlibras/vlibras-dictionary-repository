import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Version extends Model {
    static associate(models) {
      this.belongsToMany(models.Sign, { through: 'SignVersions' });
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
    timestamps: false,
  });

  return Version;
};
