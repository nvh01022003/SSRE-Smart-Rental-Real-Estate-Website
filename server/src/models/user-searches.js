'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usersearches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usersearches.init({
    user_id: DataTypes.INTEGER,
    minPrice: DataTypes.DECIMAL,
    maxPrice: DataTypes.DECIMAL,
    location: DataTypes.STRING,
    minAcreage: DataTypes.DECIMAL,
    maxAcreage: DataTypes.DECIMAL,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userSearches',
  });
  return usersearches;
};