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
    static associate({ Category, Image, Overview, User, Coordinates, Address }) {
      // define association here
      this.hasOne(Category, { foreignKey: 'id' })
      this.hasOne(Overview, { foreignKey: 'id' })
      this.hasOne(Image, { foreignKey: 'id' })
      this.hasOne(User, { foreignKey: 'id' })
      this.hasOne(Coordinates, { foreignKey: 'id' })
      this.hasOne(Address, { foreignKey: 'id' })

    }
  }
  Post.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    overview_id: DataTypes.INTEGER,
    attributes_id: DataTypes.INTEGER,
    img_id: DataTypes.STRING,
    coordinates_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    acreage: DataTypes.DOUBLE,

  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};