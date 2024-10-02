'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Transaction }) {
      // define association here
      this.hasOne(User, { foreignKey: "id" })
      this.hasMany(Transaction, { foreignKey: "wallet_id" })
    }
  }
  Wallet.init({
    user_id: DataTypes.INTEGER,
    balance: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};