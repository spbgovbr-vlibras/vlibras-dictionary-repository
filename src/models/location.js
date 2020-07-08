import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Location extends Model {
    static associate(models) {
      this.belongsTo(models.File);
    }
  }

  Location.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    location: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'Location',
    timestamps: true,
  });

  return Location;
};
