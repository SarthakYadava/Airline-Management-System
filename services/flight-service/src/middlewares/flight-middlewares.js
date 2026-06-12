const { ClientErrorCodes } = require('../utils/error-codes');
const { INTERNAL_SERVICE_TOKEN } = require('../config/serverconfig');

const allowedSorts = new Set([
    'recommended',
    'departure_asc',
    'departure_desc',
    'price_asc',
    'price_desc',
    'seats_desc'
]);

const parsePositiveInteger = (value) => {
    if(value === undefined) {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const validate_add = (req, res, next) => {
    if(
        !req.body.flightNumber ||
        !req.body.airplaneId ||
        !req.body.departureAirportId ||
        !req.body.arrivalAirportId ||
        !req.body.arrivalTime ||
        !req.body.departureTime ||
        !req.body.price
    ) {
        //if any of the body params is missing we come inside the if
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid request body for create flight',
            err: 'Missing mandatory properties to create a flight'  
        });

    }

    next();
}

const validate_update = (req, res, next) => {
    if(req.body.flightNumber) {
        //if flightNumber passed should throw an error
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid request body for updating the flight',
            err: 'flightNumber cannot be updated'  
        });

    }

    next();
}

const validate_seat_inventory = (req, res, next) => {
    const seats = Number(req.body.seats);
    if(req.headers['x-internal-service-token'] !== INTERNAL_SERVICE_TOKEN) {
        return res.status(ClientErrorCodes.UNAUTHORISED).json({
            data: {},
            success: false,
            message: 'Internal service authentication failed',
            err: 'A valid service token is required'
        });
    }
    if(!['reserve', 'release'].includes(req.body.action) || !Number.isInteger(seats) || seats < 1) {
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid seat inventory request',
            err: 'action must be reserve or release and seats must be a positive integer'
        });
    }

    req.body.seats = seats;
    next();
}

const validate_list = (req, res, next) => {
    const parsedPage = parsePositiveInteger(req.query.page);
    const parsedLimit = parsePositiveInteger(req.query.limit);
    const page = parsedPage === undefined ? 1 : parsedPage;
    const limit = parsedLimit === undefined ? 10 : parsedLimit;
    const departureAirportId = parsePositiveInteger(req.query.departureAirportId);
    const arrivalAirportId = parsePositiveInteger(req.query.arrivalAirportId);
    const minPrice = parsePositiveInteger(req.query.minPrice);
    const maxPrice = parsePositiveInteger(req.query.maxPrice);
    const sort = req.query.sort || 'recommended';
    const errors = [];

    if(page === null) errors.push('page must be a positive integer');
    if(limit === null || limit > 50) errors.push('limit must be between 1 and 50');
    if(departureAirportId === null) errors.push('departureAirportId must be a positive integer');
    if(arrivalAirportId === null) errors.push('arrivalAirportId must be a positive integer');
    if(minPrice === null) errors.push('minPrice must be a positive integer');
    if(maxPrice === null) errors.push('maxPrice must be a positive integer');
    if(minPrice && maxPrice && minPrice > maxPrice) {
        errors.push('minPrice cannot be greater than maxPrice');
    }
    if(!allowedSorts.has(sort)) {
        errors.push(`sort must be one of ${[...allowedSorts].join(', ')}`);
    }
    if(
        req.query.departureDate &&
        !/^\d{4}-\d{2}-\d{2}$/.test(req.query.departureDate)
    ) {
        errors.push('departureDate must use YYYY-MM-DD format');
    }

    if(errors.length) {
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid flight search query',
            err: {
                code: ClientErrorCodes.BAD_REQUEST,
                details: errors
            }
        });
    }

    req.flightQuery = {
        page,
        limit,
        sort,
        departureDate: req.query.departureDate,
        departureAirportId,
        arrivalAirportId,
        minPrice,
        maxPrice
    };
    next();
}

module.exports = {
    validate_add,
    validate_update,
    validate_seat_inventory,
    validate_list
}
