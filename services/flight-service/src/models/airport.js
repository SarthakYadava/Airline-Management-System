'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.City, {
        foreignKey: 'cityId',
        onDelete: 'CASCADE'
      });
      this.hasMany(models.Flights, {
        foreignKey: 'departureAirportId',
        as: 'departingFlights'
      });
      this.hasMany(models.Flights, {
        foreignKey: 'arrivalAirportId',
        as: 'arrivingFlights'
      });
    }
  }
  Airport.init({
    code: {
      type: DataTypes.STRING(3),
      unique: true,
      validate: {
        len: [3, 3]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: DataTypes.STRING,
    latitude: DataTypes.DECIMAL(9, 6),
    longitude: DataTypes.DECIMAL(9, 6),
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Airport',
  });
  return Airport;
};
