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

