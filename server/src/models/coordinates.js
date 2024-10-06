'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coordinates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Coordinates.init({
    lat: DataTypes.STRING,
    lon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Coordinates',
  });
  return Coordinates;
};