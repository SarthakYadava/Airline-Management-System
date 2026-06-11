export type Airport = {
  id: number;
  code: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  City?: {
    id: number;
    name: string;
  };
};

export type Airplane = {
  id: number;
  modelNumber: string;
  capacity: number;
};

export type Flight = {
  id: number;
  flightNumber: string;
  airplaneId: number;
  departureAirportId: number;
  arrivalAirportId: number;
  departureTime: string;
  arrivalTime: string;
  price: number;
  boardingGate?: string;
  totalSeats: number;
  departureAirport: Airport;
  arrivalAirport: Airport;
  airplane?: Airplane;
};

export type SearchValues = {
  departureAirportId: number;
  arrivalAirportId: number;
  departureDate: string;
  passengers: number;
};

export type Booking = {
  id: number;
  flightId: number;
  userId: number;
  status: 'InProcess' | 'Booked' | 'Cancelled';
  noOfSeats: number;
  totalCost: number;
  createdAt: string;
};
