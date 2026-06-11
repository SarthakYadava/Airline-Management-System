'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Airports', 'code', {
      type: Sequelize.STRING(3),
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn('Airports', 'latitude', {
      type: Sequelize.DECIMAL(9, 6),
      allowNull: true
    });
    await queryInterface.addColumn('Airports', 'longitude', {
      type: Sequelize.DECIMAL(9, 6),
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Airports', 'longitude');
    await queryInterface.removeColumn('Airports', 'latitude');
    await queryInterface.removeColumn('Airports', 'code');
  }
};

