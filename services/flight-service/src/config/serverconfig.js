const dotenv = require('dotenv');

dotenv.config();

const requiredInProduction = (name, fallback) => {
    if(process.env.NODE_ENV === 'production' && !process.env[name]) {
        throw new Error(`${name} is required in production`);
    }
    return process.env[name] || fallback;
};

module.exports = {
    PORT: process.env.PORT || 3000,
    INTERNAL_SERVICE_TOKEN: requiredInProduction('INTERNAL_SERVICE_TOKEN', 'skyroute-local-service-token')
}
