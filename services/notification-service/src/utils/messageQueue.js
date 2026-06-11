const amqplib = require('amqplib');
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');

const createChannel = async () => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } 
    catch (error) {
        throw error;
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue("QUEUE_NAME");

        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        channel.consume(applicationQueue.queue, async (msg) => {
            try {
                const payload = JSON.parse(msg.content.toString());
                await service(payload);
                channel.ack(msg);
            }
            catch (error) {
                console.error('Unable to process queued message', error);
                channel.nack(msg, false, true);
            }
        });
    } 
    catch (error) {
        throw error;
    }
}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue("QUEUE_NAME");
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } 
    catch (error) {
        throw error;
    }
}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}


