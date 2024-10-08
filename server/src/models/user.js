'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Post, Report, Favourite, Wallet, Role }) {
      this.hasMany(Post, { foreignKey: 'user_id' });
      this.hasMany(Report, { foreignKey: 'user_id' });
      this.hasMany(Favourite, { foreignKey: 'user_id' });
      this.hasOne(Wallet, { foreignKey: 'user_id' });
      this.hasOne(Role, { foreignKey: 'user_id', as: 'role' }); // Mối quan hệ 1:1 với Role
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
