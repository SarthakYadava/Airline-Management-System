const test = require('node:test');
const assert = require('node:assert/strict');

const BookingService = require('../src/services/booking-service');

test('creates a booking after reserving seats', async () => {
    const calls = {
        created: null,
        inventory: []
    };
    const bookingRepository = {
        async create(data) {
            calls.created = data;
            return { id: 7, ...data };
        }
    };
    const flightClient = {
        async patch(url, data, config) {
            calls.inventory.push({ url, data, config });
            return {
                data: {
                    data: {
                        id: 3,
                        price: 4500,
                        totalSeats: 10
                    }
                }
            };
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
    assert.equal(calls.created.status, 'Booked');
    assert.deepEqual(calls.inventory[0].data, {
        action: 'reserve',
        seats: 2
    });
    assert.equal(
        calls.inventory[0].config.headers['x-internal-service-token'],
        'skyroute-local-service-token'
    );
    assert.equal(booking.status, 'Booked');
});

test('preserves inventory conflicts returned by the flight service', async () => {
    let createCalled = false;
    const service = new BookingService({
        bookingRepository: {
            async create() {
                createCalled = true;
            }
        },
        flightClient: {
            async patch() {
                const error = new Error('Request failed');
                error.response = {
                    status: 409,
                    data: {
                        message: 'Insufficient seats',
                        err: 'The requested number of seats is not available'
                    }
                };
                throw error;
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

test('releases seats when booking persistence fails', async () => {
    const inventoryCalls = [];
    const service = new BookingService({
        bookingRepository: {
            async create() {
                const error = new Error('Database unavailable');
                error.name = 'RepositoryError';
                throw error;
            }
        },
        flightClient: {
            async patch(url, data) {
                inventoryCalls.push({ url, data });
                return {
                    data: {
                        data: {
                            id: 3,
                            price: 4500,
                            totalSeats: data.action === 'reserve' ? 10 : 12
                        }
                    }
                };
            }
        },
        flightServicePath: 'http://flights.test'
    });

    await assert.rejects(
        service.createBooking({ flightId: 3, userId: 11, noOfSeats: 2 }),
        (error) => error.name === 'RepositoryError'
    );
    assert.deepEqual(inventoryCalls, [
        {
            url: 'http://flights.test/api/v1/flight/3/seats',
            data: { action: 'reserve', seats: 2 }
        },
        {
            url: 'http://flights.test/api/v1/flight/3/seats',
            data: { action: 'release', seats: 2 }
        }
    ]);
});

test('returns bookings for the authenticated user', async () => {
    const bookingRepository = {
        async getByUser(userId) {
            return [{ id: 9, userId, status: 'Booked' }];
        }
    };
    const service = new BookingService({ bookingRepository });

    const bookings = await service.getBookings(44);

    assert.deepEqual(bookings, [{ id: 9, userId: 44, status: 'Booked' }]);
});

test('publishes a confirmation event after creating a booking', async () => {
    let published;
    const service = new BookingService({
        bookingRepository: {
            async create(data) {
                return { id: 21, ...data };
            }
        },
        flightClient: {
            async patch() {
                return {
                    data: {
                        data: {
                            id: 3,
                            price: 4500,
                            totalSeats: 9
                        }
                    }
                };
            }
        },
        flightServicePath: 'http://flights.test',
        async eventPublisher(booking, recipientEmail) {
            published = { booking, recipientEmail };
        }
    });

    const booking = await service.createBooking({
        flightId: 3,
        userId: 11,
        userEmail: 'traveler@example.com',
        noOfSeats: 1
    });

    assert.equal(booking.id, 21);
    assert.equal(published.booking.id, 21);
    assert.equal(published.recipientEmail, 'traveler@example.com');
});

test('keeps a completed booking when event publishing fails', async () => {
    const service = new BookingService({
        bookingRepository: {
            async create(data) {
                return { id: 22, ...data };
            }
        },
        flightClient: {
            async patch() {
                return {
                    data: {
                        data: {
                            id: 3,
                            price: 4500,
                            totalSeats: 9
                        }
                    }
                };
            }
        },
        flightServicePath: 'http://flights.test',
        async eventPublisher() {
            throw new Error('Broker unavailable');
        }
    });

    const booking = await service.createBooking({
        flightId: 3,
        userId: 11,
        userEmail: 'traveler@example.com',
        noOfSeats: 1
    });

    assert.equal(booking.id, 22);
    assert.equal(booking.status, 'Booked');
});
