import type {
  Airplane,
  Airport,
  Booking,
  City,
  Flight,
  SearchValues,
  Session
} from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};

const readJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getAirports = async () => {
  const response = await fetch(`${API_URL}/flightservice/api/v1/airport`);
  const payload = await readJson<ApiResponse<Airport[]>>(response);
  return payload.data.map((airport) => ({
    ...airport,
    latitude: Number(airport.latitude),
    longitude: Number(airport.longitude)
  }));
};

export const searchFlights = async (values: SearchValues) => {
  const params = new URLSearchParams({
    departureAirportId: String(values.departureAirportId),
    arrivalAirportId: String(values.arrivalAirportId),
    departureDate: values.departureDate
  });
  const response = await fetch(
    `${API_URL}/flightservice/api/v1/flight?${params.toString()}`
  );
  const payload = await readJson<ApiResponse<Flight[]>>(response);
  return payload.data;
};

export const signUp = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/authservice/api/v1/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return readJson<ApiResponse<{ id: number; email: string }>>(response);
};

export const signIn = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/authservice/api/v1/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const payload = await readJson<ApiResponse<string>>(response);
  return payload.data;
};

export const getSession = async (token: string): Promise<Session> => {
  const response = await fetch(`${API_URL}/authservice/api/v1/session`, {
    headers: { 'x-access-token': token }
  });
  const payload = await readJson<ApiResponse<Omit<Session, 'token' | 'userId'> & { id: number }>>(
    response
  );
  return {
    token,
    userId: payload.data.id,
    email: payload.data.email,
    roles: payload.data.roles,
    isAdmin: payload.data.isAdmin
  };
};

export const createBooking = async (
  token: string,
  flightId: number,
  noOfSeats: number
) => {
  const response = await fetch(`${API_URL}/bookingservice/api/v1/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify({ flightId, noOfSeats })
  });
  return readJson<ApiResponse<{ id: number; status: string; totalCost: number }>>(response);
};

export const getBookings = async (token: string) => {
  const response = await fetch(`${API_URL}/bookingservice/api/v1/booking`, {
    headers: { 'x-access-token': token }
  });
  const payload = await readJson<ApiResponse<Booking[]>>(response);
  return payload.data;
};

export const getCities = async () => {
  const response = await fetch(`${API_URL}/flightservice/api/v1/city`);
  const payload = await readJson<ApiResponse<City[]>>(response);
  return payload.data;
};

export const getAirplanes = async () => {
  const response = await fetch(`${API_URL}/flightservice/api/v1/airplane`);
  const payload = await readJson<ApiResponse<Airplane[]>>(response);
  return payload.data;
};

export const getAdminFlights = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '50',
    sort: 'departure_asc'
  });
  const response = await fetch(
    `${API_URL}/flightservice/api/v1/flight?${params.toString()}`
  );
  const payload = await readJson<ApiResponse<Flight[]>>(response);
  return payload.data;
};

type AdminResource = 'city' | 'airport' | 'airplane' | 'flight';

export const saveAdminResource = async <T>(
  token: string,
  resource: AdminResource,
  data: Record<string, unknown>,
  id?: number
) => {
  const response = await fetch(
    `${API_URL}/flightservice/api/v1/${resource}${id ? `/${id}` : ''}`,
    {
      method: id ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(data)
    }
  );
  const payload = await readJson<ApiResponse<T>>(response);
  return payload.data;
};

export const deleteAdminResource = async (
  token: string,
  resource: AdminResource,
  id: number
) => {
  const response = await fetch(`${API_URL}/flightservice/api/v1/${resource}/${id}`, {
    method: 'DELETE',
    headers: { 'x-access-token': token }
  });
  return readJson<ApiResponse<boolean>>(response);
};
