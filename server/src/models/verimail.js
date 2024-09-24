'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VeriMail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VeriMail.init({
    email: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'VeriMail',
  });
  return VeriMail;
};