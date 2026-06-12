const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/ServerConfig');

let connection;
let channel;

const createChannel = async () => {
    if(channel) {
        return channel;
    }

    connection = await amqplib.connect(MESSAGE_BROKER_URL);
    connection.on('close', () => {
        connection = undefined;
        channel = undefined;
    });
    connection.on('error', () => {});

    channel = await connection.createConfirmChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });
    return channel;
};

const publishMessage = async (bindingKey, message) => {
    const publisher = await createChannel();
    publisher.publish(
        EXCHANGE_NAME,
        bindingKey,
        Buffer.from(message),
        {
            contentType: 'application/json',
            persistent: true
        }
    );
    await publisher.waitForConfirms();
};

module.exports = {
    createChannel,
    publishMessage
}


