const { ClientErrorCodes } = require('../utils/error-codes');

const reject = (res, details) => res.status(ClientErrorCodes.BAD_REQUEST).json({
    data: {},
    success: false,
    message: 'Invalid management request',
    err: {
        code: ClientErrorCodes.BAD_REQUEST,
        details
    }
});

const validateResourceId = (req, res, next) => {
    const id = Number(req.params.id);
    if(!Number.isInteger(id) || id < 1) {
        return reject(res, ['id must be a positive integer']);
    }
    req.params.id = String(id);
    next();
};

const validateCity = (req, res, next) => {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if(name.length < 2 || name.length > 80) {
        return reject(res, ['name must contain between 2 and 80 characters']);
    }
    req.body = { name };
    next();
};

const validateAirplane = (req, res, next) => {
    const modelNumber = typeof req.body.modelNumber === 'string'
        ? req.body.modelNumber.trim()
        : '';
    const capacity = Number(req.body.capacity);
    const errors = [];

    if(modelNumber.length < 2 || modelNumber.length > 80) {
        errors.push('modelNumber must contain between 2 and 80 characters');
    }
    if(!Number.isInteger(capacity) || capacity < 1 || capacity > 850) {
        errors.push('capacity must be an integer between 1 and 850');
    }
    if(errors.length) {
        return reject(res, errors);
    }

    req.body = { modelNumber, capacity };
    next();
};

const validateAirport = (req, res, next) => {
    const code = typeof req.body.code === 'string'
        ? req.body.code.trim().toUpperCase()
        : '';
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const address = typeof req.body.address === 'string' ? req.body.address.trim() : '';
    const cityId = Number(req.body.cityId);
    const latitude = req.body.latitude === null || req.body.latitude === ''
        ? null
        : Number(req.body.latitude);
    const longitude = req.body.longitude === null || req.body.longitude === ''
        ? null
        : Number(req.body.longitude);
    const errors = [];

    if(!/^[A-Z]{3}$/.test(code)) errors.push('code must be a three-letter IATA code');
    if(name.length < 3 || name.length > 120) errors.push('name must contain between 3 and 120 characters');
    if(!address) errors.push('address is required');
    if(!Number.isInteger(cityId) || cityId < 1) errors.push('cityId must be a positive integer');
    if(latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) {
        errors.push('latitude must be between -90 and 90');
    }
    if(longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) {
        errors.push('longitude must be between -180 and 180');
    }
    if(errors.length) {
        return reject(res, errors);
    }

    req.body = { code, name, address, cityId, latitude, longitude };
    next();
};

module.exports = {
    validateAirplane,
    validateAirport,
    validateCity,
    validateResourceId
};
