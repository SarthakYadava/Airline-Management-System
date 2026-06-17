'use strict';

const futureDate = (daysFromNow, hour, minute) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromNow);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

const addMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setUTCMinutes(result.getUTCMinutes() + minutes);
  return result;
};

const routes = [
  { from: 1, to: 4, duration: 130, basePrice: 6840, gate: 'A12' },
  { from: 4, to: 1, duration: 135, basePrice: 6990, gate: 'C09' },
  { from: 4, to: 5, duration: 165, basePrice: 8140, gate: 'D02' },
  { from: 5, to: 4, duration: 170, basePrice: 8290, gate: 'B17' },
  { from: 5, to: 1, duration: 105, basePrice: 5920, gate: 'A08' },
  { from: 1, to: 5, duration: 110, basePrice: 6060, gate: 'B11' },
  { from: 4, to: 9, duration: 125, basePrice: 7120, gate: 'E04' },
  { from: 9, to: 1, duration: 90, basePrice: 5380, gate: 'C14' },
  { from: 1, to: 13, duration: 80, basePrice: 4890, gate: 'A05' },
  { from: 13, to: 1, duration: 85, basePrice: 5030, gate: 'G03' },
  { from: 4, to: 8, duration: 135, basePrice: 6420, gate: 'F12' },
  { from: 8, to: 7, duration: 145, basePrice: 5810, gate: 'C03' },
  { from: 7, to: 5, duration: 60, basePrice: 3290, gate: 'B02' },
  { from: 5, to: 9, duration: 70, basePrice: 3760, gate: 'D08' },
  { from: 4, to: 14, duration: 55, basePrice: 3140, gate: 'A19' },
  { from: 14, to: 1, duration: 105, basePrice: 4480, gate: 'E11' },
  { from: 1, to: 10, duration: 50, basePrice: 2960, gate: 'B05' },
  { from: 10, to: 5, duration: 95, basePrice: 4360, gate: 'C22' },
  { from: 11, to: 4, duration: 95, basePrice: 4580, gate: 'D14' },
  { from: 12, to: 5, duration: 75, basePrice: 3970, gate: 'F02' },
  { from: 12, to: 1, duration: 120, basePrice: 5670, gate: 'F06' },
  { from: 6, to: 5, duration: 50, basePrice: 2820, gate: 'A02' },
  { from: 1, to: 7, duration: 115, basePrice: 5260, gate: 'C18' },
  { from: 7, to: 8, duration: 135, basePrice: 6110, gate: 'E08' }
];

const departureSlots = [
  { hour: 3, minute: 35 },
  { hour: 6, minute: 20 },
  { hour: 7, minute: 10 },
  { hour: 9, minute: 15 },
  { hour: 12, minute: 45 },
  { hour: 16, minute: 30 },
  { hour: 19, minute: 5 },
  { hour: 21, minute: 40 }
];

const airplanes = [3, 1, 2, 5, 4];

const createFlights = () => {
  const createdAt = new Date();
  const flights = [];

  for(let day = 1; day <= 14; day += 1) {
    routes.forEach((route, index) => {
      const slot = departureSlots[index % departureSlots.length];
      const departureTime = futureDate(day, slot.hour, slot.minute);
      const dayPriceOffset = (day % 4) * 180;

      flights.push({
        flightNumber: `SR${String(day).padStart(2, '0')}${String(index + 1).padStart(2, '0')}`,
        airplaneId: airplanes[index % airplanes.length],
        departureAirportId: route.from,
        arrivalAirportId: route.to,
        departureTime,
        arrivalTime: addMinutes(departureTime, route.duration),
        price: route.basePrice + dayPriceOffset,
        boardingGate: route.gate,
        totalSeats: 18 + ((day + index) % 38),
        createdAt,
        updatedAt: createdAt
      });
    });
  }

  return flights;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Flights', createFlights(), {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Flights', {
      flightNumber: createFlights().map((flight) => flight.flightNumber)
    }, {});
  }
};
