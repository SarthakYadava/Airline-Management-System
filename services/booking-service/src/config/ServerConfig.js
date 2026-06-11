const dotenv = require('dotenv');

dotenv.config();

const requiredInProduction = (name) => {
    if(process.env.NODE_ENV === 'production' && !process.env[name]) {
        throw new Error(`${name} is required in production`);
    }
    return process.env[name];
};

module.exports = {
    PORT: process.env.PORT || 3002,
    FLIGHT_SERVICE_PATH: requiredInProduction('FLIGHT_SERVICE_PATH'),
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
    MESSAGE_BROKER_URL: requiredInProduction('MESSAGE_BROKER_URL'),
}
