const test = require('node:test');
const assert = require('node:assert/strict');

const {
    validateAirplane,
    validateAirport,
    validateCity,
    validateResourceId
} = require('../src/middlewares/management-middlewares');

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

test('normalizes city names', () => {
    const request = { body: { name: '  Jaipur  ' } };
    let nextCalled = false;

    validateCity(request, createResponse(), () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(request.body.name, 'Jaipur');
});

test('rejects invalid aircraft capacity', () => {
    const response = createResponse();

    validateAirplane(
        { body: { modelNumber: 'A320', capacity: 0 } },
        response,
        () => {}
    );

    assert.equal(response.statusCode, 400);
});

test('normalizes airport records', () => {
    const request = {
        body: {
            code: ' bom ',
            name: 'Mumbai International',
            address: 'Mumbai',
            cityId: '1',
            latitude: '19.0896',
            longitude: '72.8656'
        }
    };
    let nextCalled = false;

    validateAirport(request, createResponse(), () => {
        nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(request.body.code, 'BOM');
    assert.equal(request.body.cityId, 1);
    assert.equal(request.body.latitude, 19.0896);
});

test('rejects invalid management resource ids', () => {
    const response = createResponse();

    validateResourceId({ params: { id: 'abc' } }, response, () => {});

    assert.equal(response.statusCode, 400);
});
