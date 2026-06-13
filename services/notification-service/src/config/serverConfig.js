const dotenv = require('dotenv');

dotenv.config();

if(process.env.NODE_ENV === 'production' && !process.env.MESSAGE_BROKER_URL) {
    throw new Error('MESSAGE_BROKER_URL is required in production');
}

module.exports = {
    PORT: process.env.PORT || 3003,
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_JOB_SCHEDULE: process.env.EMAIL_JOB_SCHEDULE || '*/1 * * * *',
    EXCHANGE_NAME: process.env.EXCHANGE_NAME || 'skyroute',
    QUEUE_NAME: process.env.QUEUE_NAME || 'skyroute.notifications',
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY || 'notification',
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL || 'amqp://localhost',
    BROKER_RETRY_MS: Number(process.env.BROKER_RETRY_MS || 5000),
}
