'use strict';

const now = () => new Date();

const cities = [
  { id: 1, name: 'Mumbai' },
  { id: 2, name: 'New Delhi' },
  { id: 3, name: 'Chennai' },
  { id: 4, name: 'Kolkata' },
  { id: 5, name: 'Bengaluru' },
  { id: 6, name: 'Hyderabad' },
  { id: 7, name: 'Pune' },
  { id: 8, name: 'Ahmedabad' },
  { id: 9, name: 'Kochi' },
  { id: 10, name: 'Goa' },
  { id: 11, name: 'Jaipur' }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Cities', cities.map((city) => ({
      ...city,
      createdAt: now(),
      updatedAt: now()
    })), {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Cities', {
      id: cities.map((city) => city.id)
    }, {});
  }
};
