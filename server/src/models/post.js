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
    static associate({ Label, Category, Attributes, Image, Overview, User }) {
      // define association here
      this.hasOne(Label, { foreignKey: 'id' })
      this.hasOne(Category, { foreignKey: 'id' })
      this.hasOne(Attributes, { foreignKey: 'id' })
      this.hasOne(Overview, { foreignKey: 'id' })
      this.hasOne(Image, { foreignKey: 'id' })
      this.hasOne(User, { foreignKey: 'id' })

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
    img_id: DataTypes.INTEGER,
    coordinates_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};