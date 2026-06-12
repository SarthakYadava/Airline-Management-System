const test = require('node:test');
const assert = require('node:assert/strict');

const FlightService = require('../src/services/flight-service');

test('sets flight capacity from the selected airplane', async () => {
    let savedFlight = null;
    const service = new FlightService({
        airplaneRepository: {
            async get_Airplane() {
                return { id: 5, capacity: 180 };
            }
        },
        flightRepository: {
            async add_Flight(data) {
                savedFlight = data;
                return { id: 10, ...data };
            }
        }
    });
    const input = {
        flightNumber: 'SR101',
        airplaneId: 5,
        departureAirportId: 1,
        arrivalAirportId: 2,
        departureTime: '2026-07-01T10:00:00.000Z',
        arrivalTime: '2026-07-01T12:00:00.000Z',
        price: 5500
    };

    const flight = await service.add_Flight(input);

    assert.equal(savedFlight.totalSeats, 180);
    assert.equal(flight.flightNumber, 'SR101');
});

test('rejects flights that arrive before departure', async () => {
    let airplaneLookupCalled = false;
    const service = new FlightService({
        airplaneRepository: {
            async get_Airplane() {
                airplaneLookupCalled = true;
            }
        },
        flightRepository: {}
    });

    await assert.rejects(
        service.add_Flight({
            departureTime: '2026-07-01T12:00:00.000Z',
            arrivalTime: '2026-07-01T10:00:00.000Z'
        })
    );
    assert.equal(airplaneLookupCalled, false);
});

test('reserves seats through the inventory repository', async () => {
    let reservation = null;
    const service = new FlightService({
        airplaneRepository: {},
        flightRepository: {
            async reserveSeats(id, seats) {
                reservation = { id, seats };
                return {
                    status: 'reserved',
                    flight: { id, totalSeats: 7, price: 5200 }
                };
            }
        }
    });

    const flight = await service.changeSeatInventory(4, 'reserve', 3);

    assert.deepEqual(reservation, { id: 4, seats: 3 });
    assert.equal(flight.totalSeats, 7);
});

test('rejects a seat reservation when inventory is insufficient', async () => {
    const service = new FlightService({
        airplaneRepository: {},
        flightRepository: {
            async reserveSeats() {
                return { status: 'insufficient', flight: { totalSeats: 1 } };
            }
        }
    });

    await assert.rejects(
        service.changeSeatInventory(4, 'reserve', 3),
        (error) => error.statusCode === 409 && error.message === 'Insufficient seats'
    );
});

test('returns a not found error when a flight does not exist', async () => {
    const service = new FlightService({
        airplaneRepository: {},
        flightRepository: {
            async get_Flight() {
                return null;
            }
        }
    });

    await assert.rejects(
        service.get_Flight(99),
        (error) => error.statusCode === 404 &&
            error.message === 'Flight not found'
    );
});

test('returns paginated flight search results', async () => {
    const query = {
        page: 2,
        limit: 5,
        sort: 'departure_desc'
    };
    const expected = {
        flights: [{ id: 8 }],
        pagination: {
            page: 2,
            limit: 5,
            totalItems: 8,
            totalPages: 2
        }
    };
    let receivedQuery = null;
    const service = new FlightService({
        airplaneRepository: {},
        flightRepository: {
            async all_Flights(data) {
                receivedQuery = data;
                return expected;
            }
        }
    });

    const result = await service.all_Flights(query);

    assert.deepEqual(receivedQuery, query);
    assert.deepEqual(result, expected);
});
