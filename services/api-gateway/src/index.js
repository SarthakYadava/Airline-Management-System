const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

const {
    PORT,
    CLIENT_URLS,
    AUTH_SERVICE_URL,
    BOOKING_SERVICE_URL,
    FLIGHT_SERVICE_URL
} = require('./config/serverconfig');

const app = express();
app.set('trust proxy', 1);

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false
});

app.use(cors({
    origin(origin, callback) {
        if(!origin || CLIENT_URLS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin is not allowed'));
    },
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

const getAuthenticatedSession = async (req) => {
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/v1/session`, {
        headers: {
            'x-access-token': req.headers['x-access-token']
        }
    });
    return response.data.data;
};

app.use('/bookingservice', async (req, res, next) => {
    try {
        const session = await getAuthenticatedSession(req);
        req.headers['x-user-id'] = String(session.id);
        return next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
});

app.use('/flightservice', async (req, res, next) => {
    if(['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    try {
        const session = await getAuthenticatedSession(req);
        if(!session.isAdmin) {
            return res.status(403).json({
                data: {},
                success: false,
                message: 'Administrator access is required',
                err: {}
            });
        }
        req.headers['x-user-id'] = String(session.id);
        return next();
    }
    catch (error) {
        return res.status(401).json({
            data: {},
            success: false,
            message: 'Authentication required',
            err: {}
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
