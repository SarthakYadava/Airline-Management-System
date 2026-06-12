const test = require('node:test');
const assert = require('node:assert/strict');

const CityService = require('../src/services/city-service');
const AirportService = require('../src/services/airport-service');
const AirplaneService = require('../src/services/airplane-service');

test('returns 404 when a city does not exist', async () => {
    const service = new CityService({
        cityRepository: {
            async getCity() {
                return null;
            }
        }
    });

    await assert.rejects(
        service.getCity(99),
        (error) => error.statusCode === 404 && error.message === 'City not found'
    );
});

test('returns 404 when an airport update target does not exist', async () => {
    const service = new AirportService({
        airportRepository: {
            async update_Airport() {
                return null;
            }
        }
    });

    await assert.rejects(
        service.update_Airport(99, {}),
        (error) => error.statusCode === 404 && error.message === 'Airport not found'
    );
});

test('returns 404 when an aircraft delete target does not exist', async () => {
    const service = new AirplaneService({
        airplaneRepository: {
            async delete_Airplane() {
                return false;
            }
        }
    });

    await assert.rejects(
        service.delete_Airplane(99),
        (error) => error.statusCode === 404 && error.message === 'Aircraft not found'
    );
});
