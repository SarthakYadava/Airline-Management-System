const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 4000,
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL || 'http://localhost:3002',
    FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL || 'http://localhost:3000'
}
