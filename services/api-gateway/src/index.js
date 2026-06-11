const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const {
    PORT,
    CLIENT_URL,
    AUTH_SERVICE_URL,
    BOOKING_SERVICE_URL,
    FLIGHT_SERVICE_URL
} = require('./config/serverconfig');

const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);

app.get('/health', (req, res) => {
    return res.status(200).json({
        service: 'api-gateway',
        status: 'ok'
    });
});

app.use('/bookingservice', async (req, res, next) => {
    try {
        const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/isAuthenticated`, {
            headers: {
                'x-access-token': req.headers['x-access-token']
            }
        });

        if(response.data.success) {
            req.userId = response.data.data;
            req.headers['x-user-id'] = String(response.data.data);
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
});

app.use('/authservice', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true
}));

app.use('/flightservice', createProxyMiddleware({
    target: FLIGHT_SERVICE_URL,
    changeOrigin: true
}));

app.use('/bookingservice', createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true
}));

app.listen(PORT, () => {
    console.log(`API gateway started on port ${PORT}`);
});
