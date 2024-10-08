'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      this.hasOne(Post, { foreignKey: 'img_id' })
    }
  }
  Image.init({
    img_url_list: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};