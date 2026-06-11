'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Cities', [
      { id: 1, name: 'Mumbai', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'New Delhi', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Chennai', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Kolkata', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Bengaluru', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Cities', {
      id: [1, 2, 3, 4, 5]
    }, {});
  }
};

