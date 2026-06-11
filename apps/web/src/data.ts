import type { Airport, Flight } from './types';

export const demoAirports: Airport[] = [
  {
    id: 1,
    code: 'BOM',
    name: 'Chhatrapati Shivaji Maharaj International Airport',
    address: 'Mumbai, Maharashtra',
    latitude: 19.0896,
    longitude: 72.8656,
    City: { id: 1, name: 'Mumbai' }
  },
  {
    id: 2,
    code: 'DEL',
    name: 'Indira Gandhi International Airport',
    address: 'New Delhi, Delhi',
    latitude: 28.5562,
    longitude: 77.1,
    City: { id: 2, name: 'New Delhi' }
  },
  {
    id: 3,
    code: 'BLR',
    name: 'Kempegowda International Airport',
    address: 'Bengaluru, Karnataka',
    latitude: 13.1986,
    longitude: 77.7066,
    City: { id: 3, name: 'Bengaluru' }
  },
  {
    id: 4,
    code: 'IXE',
    name: 'Mangaluru International Airport',
    address: 'Mangaluru, Karnataka',
    latitude: 12.9613,
    longitude: 74.8901,
    City: { id: 4, name: 'Mangaluru' }
  }
];

const atTime = (date: string, time: string) => `${date}T${time}:00.000Z`;

export const createDemoFlights = (
  departureDate: string,
  departureAirport = demoAirports[0],
  arrivalAirport = demoAirports[1]
): Flight[] => [
  {
    id: 101,
    flightNumber: 'SR 214',
    airplaneId: 3,
    departureAirportId: departureAirport.id,
    arrivalAirportId: arrivalAirport.id,
    departureTime: atTime(departureDate, '03:35'),
    arrivalTime: atTime(departureDate, '05:45'),
    price: 6840,
    boardingGate: 'A12',
    totalSeats: 28,
    departureAirport,
    arrivalAirport,
    airplane: { id: 3, modelNumber: 'Boeing 777', capacity: 400 }
  },
  {
    id: 102,
    flightNumber: 'SR 418',
    airplaneId: 2,
    departureAirportId: departureAirport.id,
    arrivalAirportId: arrivalAirport.id,
    departureTime: atTime(departureDate, '07:10'),
    arrivalTime: atTime(departureDate, '09:20'),
    price: 7290,
    boardingGate: 'B04',
    totalSeats: 12,
    departureAirport,
    arrivalAirport,
    airplane: { id: 2, modelNumber: 'Airbus A320', capacity: 350 }
  },
  {
    id: 103,
    flightNumber: 'SR 602',
    airplaneId: 5,
    departureAirportId: departureAirport.id,
    arrivalAirportId: arrivalAirport.id,
    departureTime: atTime(departureDate, '12:45'),
    arrivalTime: atTime(departureDate, '15:00'),
    price: 7910,
    boardingGate: 'C18',
    totalSeats: 7,
    departureAirport,
    arrivalAirport,
    airplane: { id: 5, modelNumber: 'Airbus A330', capacity: 150 }
  }
];

