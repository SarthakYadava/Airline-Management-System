const test = require('node:test');
const assert = require('node:assert/strict');

const {
    createHttpError,
    sendError
} = require('../src/utils/http-responses');

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

test('formats known API errors consistently', () => {
    const response = createResponse();

    sendError(response, createHttpError(404, 'Flight not found'), 'Unable to fetch flight');

    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.body, {
        data: {},
        success: false,
        message: 'Flight not found',
        err: {
            code: 404,
            details: 'Flight not found'
        }
    });
});

test('does not expose unexpected server errors', () => {
    const response = createResponse();

    sendError(response, new Error('database password leaked'), 'Unable to fetch flight');

    assert.equal(response.statusCode, 500);
    assert.equal(response.body.message, 'Unable to fetch flight');
    assert.equal(response.body.err.details, 'An unexpected server error occurred');
});

test('unwraps repository errors and maps duplicate records', () => {
    const response = createResponse();
    const databaseError = new Error('duplicate');
    databaseError.name = 'SequelizeUniqueConstraintError';
    databaseError.errors = [{ message: 'flightNumber must be unique' }];

    sendError(response, { error: { error: databaseError } }, 'Unable to add flight');

    assert.equal(response.statusCode, 409);
    assert.equal(response.body.message, 'Resource already exists');
    assert.deepEqual(response.body.err.details, ['flightNumber must be unique']);
});
