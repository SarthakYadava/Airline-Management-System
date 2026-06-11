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
        code: "BOM",
        name: "Chhatrapati International Airport",
        address: "Mumbai, Maharashtra 400099",
        latitude: 19.089600,
        longitude: 72.865600,
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        code: "SAG",
        name: "Shirdi International Airport",
        address: "Kakadi, Shirdi, Maharashtra 423109",
        latitude: 19.688700,
        longitude: 74.378900,
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        code: "JUI",
        name: "Juhu Airport",
        address: "Mumbai, Maharashtra 400056",
        latitude: 19.098100,
        longitude: 72.834200,
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        code: "DEL",
        name: "Indira Gandhi International Airport",
        address: "New Delhi, Delhi 110037",
        latitude: 28.556200,
        longitude: 77.100000,
        cityId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        code: "BLR",
        name: "Kempegowda International Airport",
        address: "Karnataka 560300",
        latitude: 13.198600,
        longitude: 77.706600,
        cityId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        code: "IXE",
        name: "Mangaluru International Airport",
        address: "Mangaluru, Karnataka 574142",
        latitude: 12.961300,
        longitude: 74.890100,
        cityId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airports', {
      code: ['BOM', 'SAG', 'JUI', 'DEL', 'BLR', 'IXE']
    }, {});
  }
};
