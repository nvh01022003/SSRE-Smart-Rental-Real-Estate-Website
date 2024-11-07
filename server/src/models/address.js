'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      this.hasOne(
        Post,
        { foreignKey: "address_id" },
        {
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      )
    }
  }
  Address.init({
    city: DataTypes.STRING,
    district: DataTypes.STRING,
    detail_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};