const { ClientErrorCodes } = require('../utils/error-codes');
const { INTERNAL_SERVICE_TOKEN } = require('../config/serverconfig');

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

module.exports = {
    validate_add,
    validate_update,
    validate_seat_inventory
}
