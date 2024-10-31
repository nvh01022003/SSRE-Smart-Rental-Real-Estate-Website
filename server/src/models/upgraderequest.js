'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UpgradeRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.hasOne(models.Wallet, { foreignKey: 'user_id', sourcekey: 'user_id' });
    }
  }
  UpgradeRequest.init({
    full_name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    date_of_birth: DataTypes.DATE,
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    citizen_id: DataTypes.STRING,
    id_card_image_url: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

  }, {
    sequelize,
    modelName: 'UpgradeRequest',
  });
  return UpgradeRequest;
};