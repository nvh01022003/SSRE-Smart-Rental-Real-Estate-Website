'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Wallet }) {
      // define association here
      this.belongsTo(Wallet, { foreignKey: 'wallet_id' },
        {
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      );
    }
  }
  Transaction.init({
    wallet_id: DataTypes.INTEGER,
    paycode: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    transactionType: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};