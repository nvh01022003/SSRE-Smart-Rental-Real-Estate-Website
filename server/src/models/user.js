'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, Report, Favourite, Wallet, Role }) {
      // define association here
      this.hasMany(Post, { foreignKey: "user_id" })
      this.hasMany(Report, { foreignKey: "user_id" })
      this.hasMany(Favourite, { foreignKey: "user_id" })
      this.hasOne(Wallet, { foreignKey: "user_id" })
      this.hasOne(Role, { foreignKey: "user_id" })

    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    pass: DataTypes.STRING,
    phone: DataTypes.STRING,
    img_avt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};