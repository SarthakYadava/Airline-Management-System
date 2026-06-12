const test = require('node:test');
const assert = require('node:assert/strict');

const {
    validateUserAuth
} = require('../src/middlewares/auth-request-validators');

const createResponse = () => {
    const response = {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };

    return response;
};

test('rejects sign-in requests without credentials', () => {
    const response = createResponse();
    let nextCalled = false;

    validateUserAuth({ body: { email: 'traveler@example.com' } }, response, () => {
        nextCalled = true;
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.body.success, false);
    assert.equal(nextCalled, false);
});

test('accepts sign-in requests with email and password', () => {
    const response = createResponse();
    let nextCalled = false;

    validateUserAuth({
        body: {
            email: 'traveler@example.com',
            password: 'strong-password'
        }
    }, response, () => {
        nextCalled = true;
    });

    assert.equal(response.statusCode, null);
    assert.equal(nextCalled, true);
});

