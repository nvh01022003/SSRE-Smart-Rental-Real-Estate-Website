'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attributes.init({
    price: DataTypes.DECIMAL,
    acreage: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Attributes',
  });
  return Attributes;
};