'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      star: {
        type: Sequelize.STRING
      },
      label_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Labels',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING
      },
      attributes_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Attributes',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'

      },
      category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      description: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.INTEGER
      },
      overview_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'overviews',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      img_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Images',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      coordinates_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Coordinates',
          key: "id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};