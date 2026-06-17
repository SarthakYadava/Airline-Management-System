'use strict';

const now = () => new Date();

const airports = [
  {
    id: 1,
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    address: 'Mumbai, Maharashtra 400099',
    latitude: 19.089600,
    longitude: 72.865600,
    cityId: 1
  },
  {
    id: 2,
    code: 'SAG',
    name: 'Shirdi International Airport',
    address: 'Kakadi, Shirdi, Maharashtra 423109',
    latitude: 19.688700,
    longitude: 74.378900,
    cityId: 1
  },
  {
    id: 3,
    code: 'JUI',
    name: 'Juhu Airport',
    address: 'Mumbai, Maharashtra 400056',
    latitude: 19.098100,
    longitude: 72.834200,
    cityId: 1
  },
  {
    id: 4,
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    address: 'New Delhi, Delhi 110037',
    latitude: 28.556200,
    longitude: 77.100000,
    cityId: 2
  },
  {
    id: 5,
    code: 'BLR',
    name: 'Kempegowda International Airport',
    address: 'Karnataka 560300',
    latitude: 13.198600,
    longitude: 77.706600,
    cityId: 5
  },
  {
    id: 6,
    code: 'IXE',
    name: 'Mangaluru International Airport',
    address: 'Mangaluru, Karnataka 574142',
    latitude: 12.961300,
    longitude: 74.890100,
    cityId: 5
  },
  {
    id: 7,
    code: 'MAA',
    name: 'Chennai International Airport',
    address: 'Chennai, Tamil Nadu 600027',
    latitude: 12.994100,
    longitude: 80.170900,
    cityId: 3
  },
  {
    id: 8,
    code: 'CCU',
    name: 'Netaji Subhas Chandra Bose International Airport',
    address: 'Kolkata, West Bengal 700052',
    latitude: 22.654700,
    longitude: 88.446700,
    cityId: 4
  },
  {
    id: 9,
    code: 'HYD',
    name: 'Rajiv Gandhi International Airport',
    address: 'Hyderabad, Telangana 500409',
    latitude: 17.240300,
    longitude: 78.429400,
    cityId: 6
  },
  {
    id: 10,
    code: 'PNQ',
    name: 'Pune International Airport',
    address: 'Pune, Maharashtra 411032',
    latitude: 18.582100,
    longitude: 73.919700,
    cityId: 7
  },
  {
    id: 11,
    code: 'AMD',
    name: 'Sardar Vallabhbhai Patel International Airport',
    address: 'Ahmedabad, Gujarat 380003',
    latitude: 23.077200,
    longitude: 72.634700,
    cityId: 8
  },
  {
    id: 12,
    code: 'COK',
    name: 'Cochin International Airport',
    address: 'Kochi, Kerala 683111',
    latitude: 10.152000,
    longitude: 76.401900,
    cityId: 9
  },
  {
    id: 13,
    code: 'GOX',
    name: 'Manohar International Airport',
    address: 'Mopa, Goa 403512',
    latitude: 15.744500,
    longitude: 73.860600,
    cityId: 10
  },
  {
    id: 14,
    code: 'JAI',
    name: 'Jaipur International Airport',
    address: 'Jaipur, Rajasthan 302029',
    latitude: 26.824200,
    longitude: 75.812200,
    cityId: 11
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Airports', airports.map((airport) => ({
      ...airport,
      createdAt: now(),
      updatedAt: now()
    })), {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Airports', {
      code: airports.map((airport) => airport.code)
    }, {});
  }
};
