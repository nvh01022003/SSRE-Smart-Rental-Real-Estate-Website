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
    rank: DataTypes.DOUBLE,
    label: DataTypes.STRING,
    address: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    category_id: DataTypes.INTEGER,
    description: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    hashtag: DataTypes.STRING,
    area: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    zalo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};