const dotenv = require('dotenv');

dotenv.config();

if(process.env.NODE_ENV === 'production' && !process.env.MESSAGE_BROKER_URL) {
    throw new Error('MESSAGE_BROKER_URL is required in production');
}

module.exports = {
    PORT: process.env.PORT || 3003,
    EMAIL_ID: process.env.EMAIL_ID,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    BROKER_RETRY_MS: Number(process.env.BROKER_RETRY_MS || 5000),
}
