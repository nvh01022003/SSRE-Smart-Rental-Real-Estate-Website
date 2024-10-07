'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user_id', as: 'user' }); // Đảm bảo khóa ngoại đúng
    }
  }
  Role.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: true // UNIQUE đảm bảo 1:1
    },
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
