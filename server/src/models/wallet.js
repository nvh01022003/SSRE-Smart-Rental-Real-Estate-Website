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
    static associate({ User, Transaction, UpgradeRequest }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'user_id' },
        {
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }

      );
      this.hasMany(Transaction, { foreignKey: "wallet_id" },
        {
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      )
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