'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favourite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Post }) {
      // define association here
      this.hasOne(User, { foreignKey: "id" },
        {
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      )
      this.belongsTo(Post, {
        foreignKey: 'post_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    }
  }
  Favourite.init({
    user_id: DataTypes.INTEGER,
    post_id: DataTypes.INTEGER,
    statusSave: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1: Đã lưu, 0: Chưa lưu
      validate: {
        isIn: [[0, 1]],
      },
    }
  }, {
    sequelize,
    modelName: 'Favourite',
  });
  return Favourite;
};