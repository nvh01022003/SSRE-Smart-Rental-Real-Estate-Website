'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Post.init({
    title: DataTypes.STRING,
    star: DataTypes.STRING,
    label_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    attributes_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    overview_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};