'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Post, { foreignKey: 'postType_id' });
    }
  }
  PostType.init({
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    desc: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'PostType',
  });
  return PostType;
};