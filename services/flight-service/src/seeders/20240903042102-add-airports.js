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

    await queryInterface.bulkInsert('Airports', [
      {
        name: "Chhatrapati International Airport",
        address: "Mumbai, Maharashtra 400099",
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: "Shirdi International Airport",
        address: "Kakadi, Shirdi, Maharashtra 423109",
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: "Juhu Airport",
        address: "Mumbai, Maharashtra 400056",
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: "Indira Gandhi International Airport",
        address: "New Delhi, Delhi 110037",
        cityId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: "Kempegowda International Airport",
        address: "Karnataka 560300",
        cityId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        name: "Mangaluru International Airport",
        address: "Mangaluru, Karnataka 574142",
        cityId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
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
