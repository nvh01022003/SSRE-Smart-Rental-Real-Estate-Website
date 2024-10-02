'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Label extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      this.hasOne(Post, { foreignKey: "label_id" })
    }
  }
  Label.init({
    label_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Label',
  });
  return Label;
};