const test = require('node:test');
const assert = require('node:assert/strict');

const BookingService = require('../src/services/booking-service');

test('creates a booking and reduces available seats', async () => {
    const calls = {
        created: null,
        patched: null,
        updated: null
    };
    const bookingRepository = {
        async create(data) {
            calls.created = data;
            return { id: 7, ...data };
        },
        async update(id, data) {
            calls.updated = { id, data };
            return { id, status: data.status };
        }
    };
    const flightClient = {
        async get() {
            return {
                data: {
                    data: {
                        id: 3,
                        price: 4500,
                        totalSeats: 12
                    }
                }
            };
        },
        async patch(url, data) {
            calls.patched = { url, data };
        }
    };
    const service = new BookingService({
        bookingRepository,
        flightClient,
        flightServicePath: 'http://flights.test'
    });

    const booking = await service.createBooking({
        flightId: 3,
        userId: 11,
        noOfSeats: 2
    });

    assert.equal(calls.created.totalCost, 9000);
    assert.deepEqual(calls.patched, {
        url: 'http://flights.test/api/v1/flight/3',
        data: { totalSeats: 10 }
    });
    assert.deepEqual(calls.updated, {
        id: 7,
        data: { status: 'Booked' }
    });
    assert.equal(booking.status, 'Booked');
});

test('rejects bookings that request more seats than available', async () => {
    let createCalled = false;
    const service = new BookingService({
        bookingRepository: {
            async create() {
                createCalled = true;
            }
        },
        flightClient: {
            async get() {
                return {
                    data: {
                        data: {
                            price: 4500,
                            totalSeats: 1
                        }
                    }
                };
            }
        },
        flightServicePath: 'http://flights.test'
    });

    await assert.rejects(
        service.createBooking({ flightId: 3, userId: 11, noOfSeats: 2 }),
        (error) => error.statusCode === 409 && error.message === 'Insufficient seats'
    );
    assert.equal(createCalled, false);
});

