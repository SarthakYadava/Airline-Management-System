const test = require('node:test');
const assert = require('node:assert/strict');

const {
    validateAuthenticatedUser,
    validateCreateBooking
} = require('../src/middlewares/booking-request-validator');

const createResponse = () => {
    const response = {
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
    };
    return response;
};

test('rejects bookings without an authenticated user', () => {
    const request = {
        headers: {},
        body: { flightId: 3, noOfSeats: 2 }
    };
    const response = createResponse();

    validateAuthenticatedUser(request, response, () => {
        throw new Error('next should not be called');
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.body.message, 'Authentication is required');
});

test('normalizes a valid booking request', () => {
    const request = {
        headers: { 'x-user-id': '11' },
        body: { flightId: '3', noOfSeats: '2' }
    };
    const response = createResponse();
    let nextCalled = false;

    validateAuthenticatedUser(request, response, () => {
        validateCreateBooking(request, response, () => {
            nextCalled = true;
        });
    });

    assert.equal(nextCalled, true);
    assert.equal(request.authenticatedUserId, 11);
    assert.deepEqual(request.body, { flightId: 3, noOfSeats: 2 });
});

test('rejects invalid seat counts', () => {
    const request = {
        headers: { 'x-user-id': '11' },
        body: { flightId: 3, noOfSeats: 10 }
    };
    const response = createResponse();

    validateCreateBooking(request, response, () => {
        throw new Error('next should not be called');
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.message, 'Invalid booking request');
});
