const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const requiredUrl = (name, fallback) => {
    if(isProduction && !process.env[name]) {
        throw new Error(`${name} is required in production`);
    }
    return process.env[name] || fallback;
};

const CLIENT_URLS = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

module.exports = {
    PORT: process.env.PORT || 4000,
    CLIENT_URLS,
    AUTH_SERVICE_URL: requiredUrl('AUTH_SERVICE_URL', 'http://localhost:3001'),
    BOOKING_SERVICE_URL: requiredUrl('BOOKING_SERVICE_URL', 'http://localhost:3002'),
    FLIGHT_SERVICE_URL: requiredUrl('FLIGHT_SERVICE_URL', 'http://localhost:3000')
}
