import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  deleteAdminResource,
  getAdminFlights,
  getAirplanes,
  getAirports,
  getCities,
  saveAdminResource
} from './api';
import type { Airplane, Airport, City, Flight, Session } from './types';

type Section = 'cities' | 'airports' | 'aircraft' | 'flights';

type CityForm = {
  id?: number;
  name: string;
};

type AirportForm = {
  id?: number;
  code: string;
  name: string;
  address: string;
  cityId: string;
  latitude: string;
  longitude: string;
};

type AirplaneForm = {
  id?: number;
  modelNumber: string;
  capacity: string;
};

type FlightForm = {
  id?: number;
  flightNumber: string;
  airplaneId: string;
  departureAirportId: string;
  arrivalAirportId: string;
  departureTime: string;
  arrivalTime: string;
  price: string;
};

type AdminDashboardProps = {
  session: Session;
  onClose: () => void;
};

const emptyCity: CityForm = { name: '' };
const emptyAirport: AirportForm = {
  code: '',
  name: '',
  address: '',
  cityId: '',
  latitude: '',
  longitude: ''
};
const emptyAirplane: AirplaneForm = { modelNumber: '', capacity: '' };
const emptyFlight: FlightForm = {
  flightNumber: '',
  airplaneId: '',
  departureAirportId: '',
  arrivalAirportId: '',
  departureTime: '',
  arrivalTime: '',
  price: ''
};

const toDateTimeInput = (value: string) => {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));

function AdminDashboard({ session, onClose }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>('flights');
  const [cities, setCities] = useState<City[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [cityForm, setCityForm] = useState<CityForm>(emptyCity);
  const [airportForm, setAirportForm] = useState<AirportForm>(emptyAirport);
  const [airplaneForm, setAirplaneForm] = useState<AirplaneForm>(emptyAirplane);
  const [flightForm, setFlightForm] = useState<FlightForm>(emptyFlight);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setError('');
    try {
      const [nextCities, nextAirports, nextAirplanes, nextFlights] =
        await Promise.all([
          getCities(),
          getAirports(),
          getAirplanes(),
          getAdminFlights()
        ]);
      setCities(nextCities);
      setAirports(nextAirports);
      setAirplanes(nextAirplanes);
      setFlights(nextFlights);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const runMutation = async (action: () => Promise<unknown>, reset: () => void) => {
    setIsSaving(true);
    setError('');
    try {
      await action();
      reset();
      await loadData();
    } catch (mutationError) {
      setError(
        mutationError instanceof Error ? mutationError.message : 'Unable to save changes'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const submitCity = (event: FormEvent) => {
    event.preventDefault();
    void runMutation(
      () => saveAdminResource(
        session.token,
        'city',
        { name: cityForm.name.trim() },
        cityForm.id
      ),
      () => setCityForm(emptyCity)
    );
  };

  const submitAirport = (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      code: airportForm.code.trim().toUpperCase(),
      name: airportForm.name.trim(),
      address: airportForm.address.trim(),
      cityId: Number(airportForm.cityId),
      latitude: airportForm.latitude ? Number(airportForm.latitude) : null,
      longitude: airportForm.longitude ? Number(airportForm.longitude) : null
    };
    void runMutation(
      () => saveAdminResource(session.token, 'airport', payload, airportForm.id),
      () => setAirportForm(emptyAirport)
    );
  };

  const submitAirplane = (event: FormEvent) => {
    event.preventDefault();
    void runMutation(
      () => saveAdminResource(
        session.token,
        'airplane',
        {
          modelNumber: airplaneForm.modelNumber.trim(),
          capacity: Number(airplaneForm.capacity)
        },
        airplaneForm.id
      ),
      () => setAirplaneForm(emptyAirplane)
    );
  };

  const submitFlight = (event: FormEvent) => {
    event.preventDefault();
    if(flightForm.departureAirportId === flightForm.arrivalAirportId) {
      setError('Departure and arrival airports must be different');
      return;
    }
    if(new Date(flightForm.arrivalTime) <= new Date(flightForm.departureTime)) {
      setError('Arrival time must be after departure time');
      return;
    }

    const payload: Record<string, unknown> = {
      airplaneId: Number(flightForm.airplaneId),
      departureAirportId: Number(flightForm.departureAirportId),
      arrivalAirportId: Number(flightForm.arrivalAirportId),
      departureTime: new Date(flightForm.departureTime).toISOString(),
      arrivalTime: new Date(flightForm.arrivalTime).toISOString(),
      price: Number(flightForm.price)
    };
    if(!flightForm.id) {
      payload.flightNumber = flightForm.flightNumber.trim().toUpperCase();
    }

    void runMutation(
      () => saveAdminResource(session.token, 'flight', payload, flightForm.id),
      () => setFlightForm(emptyFlight)
    );
  };

  const removeResource = (
    resource: 'city' | 'airport' | 'airplane' | 'flight',
    id: number,
    label: string
  ) => {
    if(!window.confirm(`Delete ${label}? This cannot be undone.`)) {
      return;
    }
    void runMutation(
      () => deleteAdminResource(session.token, resource, id),
      () => undefined
    );
  };

  const editAirport = (airport: Airport) => {
    setAirportForm({
      id: airport.id,
      code: airport.code || '',
      name: airport.name,
      address: airport.address || '',
      cityId: String(airport.City?.id || ''),
      latitude: airport.latitude ? String(airport.latitude) : '',
      longitude: airport.longitude ? String(airport.longitude) : ''
    });
  };

  const editFlight = (flight: Flight) => {
    setFlightForm({
      id: flight.id,
      flightNumber: flight.flightNumber,
      airplaneId: String(flight.airplaneId),
      departureAirportId: String(flight.departureAirportId),
      arrivalAirportId: String(flight.arrivalAirportId),
      departureTime: toDateTimeInput(flight.departureTime),
      arrivalTime: toDateTimeInput(flight.arrivalTime),
      price: String(flight.price)
    });
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <button className="admin-brand" type="button" onClick={onClose}>
          <span className="brand-mark">S</span>
          <span>
            <strong>SkyRoute</strong>
            <small>Management</small>
          </span>
        </button>
        <nav aria-label="Management sections">
          {(['flights', 'airports', 'cities', 'aircraft'] as Section[]).map((section) => (
            <button
              className={activeSection === section ? 'active' : ''}
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
            >
              {section}
            </button>
          ))}
        </nav>
        <div className="admin-user">
          <span>Signed in as</span>
          <strong>{session.email}</strong>
          <button type="button" onClick={onClose}>Back to booking site</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <span className="section-kicker">Operations center</span>
            <h1>Manage the network.</h1>
          </div>
          <button type="button" onClick={() => void loadData()} disabled={isLoading}>
            Refresh data
          </button>
        </header>

        <div className="admin-summaries">
          <article><span>Scheduled flights</span><strong>{flights.length}</strong></article>
          <article><span>Airports</span><strong>{airports.length}</strong></article>
          <article><span>Cities</span><strong>{cities.length}</strong></article>
          <article><span>Fleet types</span><strong>{airplanes.length}</strong></article>
        </div>

        {error && <div className="admin-error" role="alert">{error}</div>}
        {isLoading ? (
          <div className="admin-loading">Loading management data...</div>
        ) : (
          <div className="admin-workspace">
            {activeSection === 'cities' && (
              <>
                <form className="admin-form" onSubmit={submitCity}>
                  <div>
                    <span className="section-kicker">City record</span>
                    <h2>{cityForm.id ? 'Edit city' : 'Add a city'}</h2>
                  </div>
                  <label>
                    <span>City name</span>
                    <input
                      required
                      minLength={2}
                      value={cityForm.name}
                      onChange={(event) => setCityForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))}
                    />
                  </label>
                  <div className="admin-form-actions">
                    {cityForm.id && (
                      <button type="button" onClick={() => setCityForm(emptyCity)}>Cancel</button>
                    )}
                    <button className="primary" type="submit" disabled={isSaving}>
                      {cityForm.id ? 'Save city' : 'Add city'}
                    </button>
                  </div>
                </form>
                <div className="admin-table-card">
                  <table>
                    <thead><tr><th>City</th><th>ID</th><th>Actions</th></tr></thead>
                    <tbody>
                      {cities.map((city) => (
                        <tr key={city.id}>
                          <td><strong>{city.name}</strong></td>
                          <td>#{city.id}</td>
                          <td className="admin-row-actions">
                            <button type="button" onClick={() => setCityForm(city)}>Edit</button>
                            <button type="button" onClick={() => removeResource('city', city.id, city.name)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeSection === 'airports' && (
              <>
                <form className="admin-form admin-form-grid" onSubmit={submitAirport}>
                  <div className="admin-form-title">
                    <span className="section-kicker">Airport record</span>
                    <h2>{airportForm.id ? 'Edit airport' : 'Add an airport'}</h2>
                  </div>
                  <label><span>IATA code</span><input required minLength={3} maxLength={3} value={airportForm.code} onChange={(event) => setAirportForm((current) => ({ ...current, code: event.target.value }))} /></label>
                  <label><span>Airport name</span><input required value={airportForm.name} onChange={(event) => setAirportForm((current) => ({ ...current, name: event.target.value }))} /></label>
                  <label><span>City</span><select required value={airportForm.cityId} onChange={(event) => setAirportForm((current) => ({ ...current, cityId: event.target.value }))}><option value="">Select city</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label>
                  <label><span>Address</span><input required value={airportForm.address} onChange={(event) => setAirportForm((current) => ({ ...current, address: event.target.value }))} /></label>
                  <label><span>Latitude</span><input type="number" step="0.000001" value={airportForm.latitude} onChange={(event) => setAirportForm((current) => ({ ...current, latitude: event.target.value }))} /></label>
                  <label><span>Longitude</span><input type="number" step="0.000001" value={airportForm.longitude} onChange={(event) => setAirportForm((current) => ({ ...current, longitude: event.target.value }))} /></label>
                  <div className="admin-form-actions">
                    {airportForm.id && <button type="button" onClick={() => setAirportForm(emptyAirport)}>Cancel</button>}
                    <button className="primary" type="submit" disabled={isSaving}>{airportForm.id ? 'Save airport' : 'Add airport'}</button>
                  </div>
                </form>
                <div className="admin-table-card">
                  <table>
                    <thead><tr><th>Code</th><th>Airport</th><th>City</th><th>Actions</th></tr></thead>
                    <tbody>{airports.map((airport) => <tr key={airport.id}><td><strong>{airport.code}</strong></td><td>{airport.name}</td><td>{airport.City?.name || 'Unassigned'}</td><td className="admin-row-actions"><button type="button" onClick={() => editAirport(airport)}>Edit</button><button type="button" onClick={() => removeResource('airport', airport.id, airport.code)}>Delete</button></td></tr>)}</tbody>
                  </table>
                </div>
              </>
            )}

            {activeSection === 'aircraft' && (
              <>
                <form className="admin-form admin-form-grid" onSubmit={submitAirplane}>
                  <div className="admin-form-title"><span className="section-kicker">Fleet record</span><h2>{airplaneForm.id ? 'Edit aircraft' : 'Add aircraft'}</h2></div>
                  <label><span>Model</span><input required value={airplaneForm.modelNumber} onChange={(event) => setAirplaneForm((current) => ({ ...current, modelNumber: event.target.value }))} /></label>
                  <label><span>Seat capacity</span><input required type="number" min="1" max="850" value={airplaneForm.capacity} onChange={(event) => setAirplaneForm((current) => ({ ...current, capacity: event.target.value }))} /></label>
                  <div className="admin-form-actions">
                    {airplaneForm.id && <button type="button" onClick={() => setAirplaneForm(emptyAirplane)}>Cancel</button>}
                    <button className="primary" type="submit" disabled={isSaving}>{airplaneForm.id ? 'Save aircraft' : 'Add aircraft'}</button>
                  </div>
                </form>
                <div className="admin-table-card">
                  <table>
                    <thead><tr><th>Model</th><th>Capacity</th><th>Actions</th></tr></thead>
                    <tbody>{airplanes.map((airplane) => <tr key={airplane.id}><td><strong>{airplane.modelNumber}</strong></td><td>{airplane.capacity} seats</td><td className="admin-row-actions"><button type="button" onClick={() => setAirplaneForm({ id: airplane.id, modelNumber: airplane.modelNumber, capacity: String(airplane.capacity) })}>Edit</button><button type="button" onClick={() => removeResource('airplane', airplane.id, airplane.modelNumber)}>Delete</button></td></tr>)}</tbody>
                  </table>
                </div>
              </>
            )}

            {activeSection === 'flights' && (
              <>
                <form className="admin-form admin-form-grid" onSubmit={submitFlight}>
                  <div className="admin-form-title"><span className="section-kicker">Flight schedule</span><h2>{flightForm.id ? 'Edit flight' : 'Schedule a flight'}</h2></div>
                  <label><span>Flight number</span><input required disabled={Boolean(flightForm.id)} value={flightForm.flightNumber} onChange={(event) => setFlightForm((current) => ({ ...current, flightNumber: event.target.value }))} /></label>
                  <label><span>Aircraft</span><select required value={flightForm.airplaneId} onChange={(event) => setFlightForm((current) => ({ ...current, airplaneId: event.target.value }))}><option value="">Select aircraft</option>{airplanes.map((airplane) => <option key={airplane.id} value={airplane.id}>{airplane.modelNumber} ({airplane.capacity})</option>)}</select></label>
                  <label><span>Departure airport</span><select required value={flightForm.departureAirportId} onChange={(event) => setFlightForm((current) => ({ ...current, departureAirportId: event.target.value }))}><option value="">Select airport</option>{airports.map((airport) => <option key={airport.id} value={airport.id}>{airport.code} - {airport.City?.name}</option>)}</select></label>
                  <label><span>Arrival airport</span><select required value={flightForm.arrivalAirportId} onChange={(event) => setFlightForm((current) => ({ ...current, arrivalAirportId: event.target.value }))}><option value="">Select airport</option>{airports.map((airport) => <option key={airport.id} value={airport.id}>{airport.code} - {airport.City?.name}</option>)}</select></label>
                  <label><span>Departure time</span><input required type="datetime-local" value={flightForm.departureTime} onChange={(event) => setFlightForm((current) => ({ ...current, departureTime: event.target.value }))} /></label>
                  <label><span>Arrival time</span><input required type="datetime-local" value={flightForm.arrivalTime} onChange={(event) => setFlightForm((current) => ({ ...current, arrivalTime: event.target.value }))} /></label>
                  <label><span>Base fare (INR)</span><input required type="number" min="1" value={flightForm.price} onChange={(event) => setFlightForm((current) => ({ ...current, price: event.target.value }))} /></label>
                  <div className="admin-form-actions">
                    {flightForm.id && <button type="button" onClick={() => setFlightForm(emptyFlight)}>Cancel</button>}
                    <button className="primary" type="submit" disabled={isSaving}>{flightForm.id ? 'Save flight' : 'Schedule flight'}</button>
                  </div>
                </form>
                <div className="admin-table-card">
                  <table>
                    <thead><tr><th>Flight</th><th>Route</th><th>Departure</th><th>Seats</th><th>Actions</th></tr></thead>
                    <tbody>{flights.map((flight) => <tr key={flight.id}><td><strong>{flight.flightNumber}</strong><small>{flight.airplane?.modelNumber}</small></td><td>{flight.departureAirport?.code} to {flight.arrivalAirport?.code}</td><td>{formatDateTime(flight.departureTime)}</td><td>{flight.totalSeats}</td><td className="admin-row-actions"><button type="button" onClick={() => editFlight(flight)}>Edit</button><button type="button" onClick={() => removeResource('flight', flight.id, flight.flightNumber)}>Delete</button></td></tr>)}</tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
