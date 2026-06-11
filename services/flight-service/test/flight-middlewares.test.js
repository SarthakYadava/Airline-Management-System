const test = require('node:test');
const assert = require('node:assert/strict');

const {
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
