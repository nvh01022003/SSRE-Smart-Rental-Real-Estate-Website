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
    static associate({ Category, Image, Overview, User, Coordinates, Address, PostType }) {
      // define association here
      this.belongsTo(Category, { foreignKey: 'category_id' })

      // this.belongsTo(Image, { foreignKey: 'img_id' });
      // this.belongsTo(User, { foreignKey: 'user_id' })
      // this.hasOne(Coordinates, { foreignKey: 'id' })
      // this.belongsTo(Address, { foreignKey: 'address_id' });
      // this.belongsTo(Overview, { foreignKey: 'overview_id' });

      this.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'CASCADE' });
      this.belongsTo(Image, { foreignKey: 'img_id', onDelete: 'CASCADE' });
      this.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      this.belongsTo(Coordinates, { foreignKey: 'coordinates_id', onDelete: 'CASCADE' });
      this.belongsTo(Address, { foreignKey: 'address_id', onDelete: 'CASCADE' });
      this.belongsTo(Overview, { foreignKey: 'overview_id', onDelete: 'CASCADE' });
      this.belongsTo(PostType, { foreignKey: 'postType_id', onDelete: 'CASCADE' });

    }
  }
  Post.init({
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    category_id: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    overview_id: DataTypes.INTEGER,
    img_id: DataTypes.STRING,
    coordinates_id: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(10, 2),
    acreage: DataTypes.DOUBLE,
    // loại bài đăng
    postType_id: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'Post',
    hooks: {
      beforeDestroy: async (posts, options) => {
        const { Image, Address, Overview, Coordinates } = sequelize.models;
        try {
          console.log('Deleting related records:', posts);
          await Image.destroy({ where: { id: posts.img_id } });
          await Address.destroy({ where: { id: posts.address_id } });
          await Overview.destroy({ where: { id: posts.overview_id } });
          await Coordinates.destroy({ where: { id: posts.coordinates_id } });
        } catch (error) {
          console.log('Error deleting related records:', error);
          throw error;
        }
      }
    }
  });
  return Post;
};