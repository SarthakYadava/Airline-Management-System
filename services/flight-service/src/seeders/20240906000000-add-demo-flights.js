'use strict';

const futureDate = (daysFromNow, hour, minute) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromNow);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const createdAt = new Date();

    await queryInterface.bulkInsert('Flights', [
      {
        flightNumber: 'SR214',
        airplaneId: 3,
        departureAirportId: 1,
        arrivalAirportId: 4,
        departureTime: futureDate(1, 3, 35),
        arrivalTime: futureDate(1, 5, 45),
        price: 6840,
        boardingGate: 'A12',
        totalSeats: 28,
        createdAt,
        updatedAt: createdAt
      },
      {
        flightNumber: 'SR418',
        airplaneId: 2,
        departureAirportId: 1,
        arrivalAirportId: 4,
        departureTime: futureDate(1, 7, 10),
        arrivalTime: futureDate(1, 9, 20),
        price: 7290,
        boardingGate: 'B04',
        totalSeats: 12,
        createdAt,
        updatedAt: createdAt
      },
      {
        flightNumber: 'SR602',
        airplaneId: 5,
        departureAirportId: 1,
        arrivalAirportId: 4,
        departureTime: futureDate(1, 12, 45),
        arrivalTime: futureDate(1, 15, 0),
        price: 7910,
        boardingGate: 'C18',
        totalSeats: 7,
        createdAt,
        updatedAt: createdAt
      },
      {
        flightNumber: 'SR305',
        airplaneId: 1,
        departureAirportId: 4,
        arrivalAirportId: 5,
        departureTime: futureDate(1, 6, 20),
        arrivalTime: futureDate(1, 9, 5),
        price: 8140,
        boardingGate: 'D02',
        totalSeats: 41,
        createdAt,
        updatedAt: createdAt
      },
      {
        flightNumber: 'SR118',
        airplaneId: 4,
        departureAirportId: 5,
        arrivalAirportId: 1,
        departureTime: futureDate(2, 9, 15),
        arrivalTime: futureDate(2, 11, 0),
        price: 5920,
        boardingGate: 'A08',
        totalSeats: 33,
        createdAt,
        updatedAt: createdAt
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Flights', {
      flightNumber: ['SR214', 'SR418', 'SR602', 'SR305', 'SR118']
    }, {});
  }
};

