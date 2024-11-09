'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UpgradeRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Đảm bảo bảng 'Users' được viết đúng
          key: 'id',
          unique: true // Đảm bảo ràng buộc UNIQUE để tạo quan hệ 1:1
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        unique: true // Đảm bảo ràng buộc UNIQUE để tạo quan hệ 1:1
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      address: {
        type: Sequelize.STRING
      },
      contact: {
        type: Sequelize.STRING
      },
      citizen_id: {
        type: Sequelize.STRING
      },
      id_card_image_url: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('UpgradeRequests');
  }
};