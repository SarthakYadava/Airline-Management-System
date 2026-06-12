const amqplib = require('amqplib');
const {
    MESSAGE_BROKER_URL,
    EXCHANGE_NAME,
    QUEUE_NAME
} = require('../config/serverConfig');

const createChannel = async () => {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    return channel;
};

const subscribeMessage = async (channel, service, bindingKey) => {
    const applicationQueue = await channel.assertQueue(QUEUE_NAME, {
        durable: true
    });

    await channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, bindingKey);
    await channel.prefetch(5);

    await channel.consume(applicationQueue.queue, async (message) => {
        if(!message) {
            return;
        }
        try {
            const payload = JSON.parse(message.content.toString());
            await service(payload);
            channel.ack(message);
        }
        catch (error) {
            console.error('Unable to process queued message', error.message);
            channel.nack(message, false, false);
        }
    });
};

module.exports = {
    createChannel,
    subscribeMessage
}


