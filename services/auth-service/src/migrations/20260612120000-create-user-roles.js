'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User_Roles', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UserId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      RoleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Roles',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('User_Roles');
  }
};
