'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('Roles', [
      {
        name: 'ADMIN',
        createdAT: new Date(),
        updatedAT: new Date()
      },
      {
        name: 'CUSTOMER',
        createdAT: new Date(),
        updatedAT: new Date()
      },
      {
        name: 'AIRLINE_BUSINESS',
        createdAT: new Date(),
        updatedAT: new Date()
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
