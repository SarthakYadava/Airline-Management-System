const test = require('node:test');
const assert = require('node:assert/strict');

const {
    validate_list,
    validate_seat_inventory
} = require('../src/middlewares/flight-middlewares');

const createResponse = () => ({
    statusCode: null,
    body: null,
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    },
    json(body) {
        this.body = body;
        return this;
    }
});

test('rejects seat inventory updates without a service token', () => {
    const request = {
        headers: {},
        body: { action: 'reserve', seats: 2 }
    };
    const response = createResponse();

    validate_seat_inventory(request, response, () => {
        throw new Error('next should not be called');
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.body.message, 'Internal service authentication failed');
});

test('normalizes valid seat inventory updates', () => {
    const request = {
        headers: {
            'x-internal-service-token': 'skyroute-local-service-token'
        },
        body: { action: 'reserve', seats: '2' }
    };
    const response = createResponse();
    let nextCalled = false;

    validate_seat_inventory(request, response, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(request.body.seats, 2);
});

test('applies defaults to a valid flight search query', () => {
    const request = {
        query: {
            departureAirportId: '1',
            arrivalAirportId: '2',
            departureDate: '2026-07-01'
        }
    };
    const response = createResponse();
    let nextCalled = false;

    validate_list(request, response, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.deepEqual(request.flightQuery, {
        page: 1,
        limit: 10,
        sort: 'recommended',
        departureDate: '2026-07-01',
        departureAirportId: 1,
        arrivalAirportId: 2,
        minPrice: undefined,
        maxPrice: undefined
    });
});

test('normalizes pagination, prices, and sorting', () => {
    const request = {
        query: {
            page: '2',
            limit: '25',
            minPrice: '4000',
            maxPrice: '9000',
            sort: 'price_desc'
        }
    };
    const response = createResponse();
    let nextCalled = false;

    validate_list(request, response, () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(request.flightQuery.page, 2);
    assert.equal(request.flightQuery.limit, 25);
    assert.equal(request.flightQuery.minPrice, 4000);
    assert.equal(request.flightQuery.maxPrice, 9000);
    assert.equal(request.flightQuery.sort, 'price_desc');
});

test('rejects malformed flight search queries', () => {
    const request = {
        query: {
            page: '0',
            limit: '100',
            minPrice: '9000',
            maxPrice: '4000',
            departureDate: '01-07-2026',
            sort: 'fastest'
        }
    };
    const response = createResponse();

    validate_list(request, response, () => {
        throw new Error('next should not be called');
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.message, 'Invalid flight search query');
    assert.equal(response.body.err.details.length, 5);
});
