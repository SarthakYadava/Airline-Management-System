const test = require('node:test');
const assert = require('node:assert/strict');

const { subscribeMessage } = require('../src/utils/messageQueue');

const createChannel = () => {
    const calls = {
        ack: [],
        bindQueue: [],
        consume: null,
        nack: [],
        prefetch: null,
        queue: null
    };
    return {
        calls,
        async assertQueue(queue, options) {
            calls.queue = { queue, options };
            return { queue };
        },
        async bindQueue(...args) {
            calls.bindQueue.push(args);
        },
        async prefetch(value) {
            calls.prefetch = value;
        },
        async consume(queue, handler) {
            calls.consume = { queue, handler };
        },
        ack(message) {
            calls.ack.push(message);
        },
        nack(...args) {
            calls.nack.push(args);
        }
    };
};

test('consumes and acknowledges valid notification events', async () => {
    const channel = createChannel();
    let received;
    await subscribeMessage(channel, async (payload) => {
        received = payload;
    }, 'notification');

    const message = {
        content: Buffer.from(JSON.stringify({
            service: 'CREATE_TICKET',
            data: { subject: 'Booking confirmed' }
        }))
    };
    await channel.calls.consume.handler(message);

    assert.equal(channel.calls.queue.queue, 'skyroute.notifications');
    assert.equal(channel.calls.queue.options.durable, true);
    assert.deepEqual(channel.calls.bindQueue, [
        ['skyroute.notifications', 'skyroute', 'notification']
    ]);
    assert.equal(channel.calls.prefetch, 5);
    assert.equal(received.service, 'CREATE_TICKET');
    assert.deepEqual(channel.calls.ack, [message]);
    assert.deepEqual(channel.calls.nack, []);
});

test('rejects malformed events without requeueing them', async () => {
    const channel = createChannel();
    await subscribeMessage(channel, async () => {}, 'notification');

    const message = {
        content: Buffer.from('not-json')
    };
    await channel.calls.consume.handler(message);

    assert.deepEqual(channel.calls.ack, []);
    assert.deepEqual(channel.calls.nack, [[message, false, false]]);
});
