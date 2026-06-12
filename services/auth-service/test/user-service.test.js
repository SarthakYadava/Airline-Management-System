const test = require('node:test');
const assert = require('node:assert/strict');

const UserService = require('../src/services/user-service');

test('waits for the authenticated user lookup', async () => {
    const userRepository = {
        async get_User(id) {
            await new Promise((resolve) => setTimeout(resolve, 5));
            return { id, email: 'traveler@example.com' };
        }
    };
    const service = new UserService({ userRepository });
    service.verifyToken = () => ({ id: 42 });

    const userId = await service.isAuthenticated('valid-token');

    assert.equal(userId, 42);
});

test('rejects a token for a user that no longer exists', async () => {
    const service = new UserService({
        userRepository: {
            async get_User() {
                return null;
            }
        }
    });
    service.verifyToken = () => ({ id: 99 });

    await assert.rejects(
        service.isAuthenticated('orphaned-token'),
        (error) => error.error.error === 'No user with the corresponding token exists'
    );
});

test('returns an authenticated admin session from token roles', async () => {
    const service = new UserService({
        userRepository: {
            async getSessionUser(id) {
                return {
                    id,
                    email: 'admin@example.com',
                    Roles: [{ name: 'ADMIN' }, { name: 'CUSTOMER' }]
                };
            }
        }
    });
    service.verifyToken = () => ({ id: 7 });

    const session = await service.getSession('admin-token');

    assert.deepEqual(session, {
        id: 7,
        email: 'admin@example.com',
        roles: ['ADMIN', 'CUSTOMER'],
        isAdmin: true
    });
});

test('returns a non-admin session for regular customers', async () => {
    const service = new UserService({
        userRepository: {
            async getSessionUser(id) {
                return {
                    id,
                    email: 'traveler@example.com',
                    Roles: [{ name: 'CUSTOMER' }]
                };
            }
        }
    });
    service.verifyToken = () => ({ id: 8 });

    const session = await service.getSession('customer-token');

    assert.equal(session.isAdmin, false);
});
