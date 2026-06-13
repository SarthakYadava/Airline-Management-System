const test = require('node:test');
const assert = require('node:assert/strict');

const { deliverPendingEmails } = require('../src/utils/job');

test('marks delivered notification tickets as successful', async () => {
    const updates = [];
    const result = await deliverPendingEmails({
        mailer: {
            async sendMail(message) {
                assert.equal(message.to, 'traveler@example.com');
            }
        },
        service: {
            async fetchPendingEmails() {
                return [{
                    id: 4,
                    recepientEmail: 'traveler@example.com',
                    subject: 'Booking confirmed',
                    content: 'Your booking is confirmed.'
                }];
            },
            async updateTicket(id, data) {
                updates.push({ id, data });
            }
        }
    });

    assert.deepEqual(result, {
        delivered: 1,
        failed: 0,
        skipped: false
    });
    assert.deepEqual(updates, [{
        id: 4,
        data: { status: 'SUCCESS' }
    }]);
});

test('marks failed notification tickets without stopping the batch', async () => {
    const updates = [];
    const errors = [];
    const result = await deliverPendingEmails({
        mailer: {
            async sendMail() {
                throw new Error('SMTP unavailable');
            }
        },
        service: {
            async fetchPendingEmails() {
                return [{
                    id: 5,
                    recepientEmail: 'traveler@example.com',
                    subject: 'Booking confirmed',
                    content: 'Your booking is confirmed.'
                }];
            },
            async updateTicket(id, data) {
                updates.push({ id, data });
            }
        },
        logger: {
            error(...args) {
                errors.push(args);
            }
        }
    });

    assert.deepEqual(result, {
        delivered: 0,
        failed: 1,
        skipped: false
    });
    assert.deepEqual(updates, [{
        id: 5,
        data: { status: 'FAILED' }
    }]);
    assert.equal(errors.length, 1);
});

test('skips delivery when no mail transport is configured', async () => {
    const result = await deliverPendingEmails({
        mailer: null,
        service: {
            async fetchPendingEmails() {
                throw new Error('should not be called');
            }
        }
    });

    assert.deepEqual(result, {
        delivered: 0,
        failed: 0,
        skipped: true
    });
});
