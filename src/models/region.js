import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Region extends Model {
    associate(models) {
      this.belongsToMany(models.File, { through: 'FileRegions' });
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
    sequelize,
    modelName: 'Region',
    timestamps: true,
  });

  return Region;
};
